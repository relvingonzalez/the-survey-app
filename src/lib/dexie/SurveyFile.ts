import { Entity } from "dexie";
import DexieObject from "./DexieObject";
import {
  ServerFile,
  ServerMoreInfoFile,
  ServerQuestionResponseFile,
  ServerRackFile,
  ServerRoomFile,
  ServerSignature,
} from "../types/server";
import {
  ActionFlag,
  addItem,
  addItems,
  addItemsFromServer,
  Comment,
  createItem,
  db,
  getDeletedItemsByTable,
  getUpdatedItemsByTable,
  MoreInfo,
  Rack,
  Room,
  saveItem,
  shouldIncludeId,
  updateItem,
  type TheSurveyAppDB,
} from "../../../internal";
import { saveFile } from "../api/actions";

export class SurveyFile
  extends Entity<TheSurveyAppDB>
  implements DexieObject<SurveyFile>
{
  localId!: number;
  flag!: ActionFlag;
  id!: number;
  questionResponseId!: number;
  roomId!: number;
  rackId!: number;
  moreInfoId!: number;
  signatureTypeId!: number;
  isPlan!: boolean;
  url!: string;
  annotation!: string;
  file!: File;
  projectId!: number;

  static create({ ...props }: Partial<SurveyFile>) {
    return createItem(SurveyFile.prototype, props);
  }

  static add({ ...props }: Partial<SurveyFile>) {
    return addItem(db.surveyFiles, SurveyFile.create(props));
  }

  static async bulkAdd(surveyFiles: Partial<SurveyFile>[]) {
    return addItems(SurveyFile.add, surveyFiles);
  }

  static async bulkAddFromServer(surveyFiles: Partial<SurveyFile>[]) {
    return addItemsFromServer(SurveyFile.add, surveyFiles);
  }

  static async getByResponse({ id: questionResponseId }: Comment) {
    return await db.surveyFiles
      .where({ questionResponseId })
      .and((r) => r.flag !== "d")
      .toArray();
  }

  static async getByRoom({ id: roomId }: Room) {
    return await db.surveyFiles
      .where({ roomId })
      .and((r) => !r.isPlan && r.flag !== "d")
      .toArray();
  }

  static async getPlanByRoom({ id: roomId }: Room) {
    return await db.surveyFiles
      .where({ roomId })
      .and((r) => r.isPlan && r.flag !== "d")
      .first();
  }

  static async getByRack({ id: rackId }: Rack) {
    return await db.surveyFiles
      .where({ rackId })
      .and((r) => r.flag !== "d")
      .toArray();
  }

  static async getByMoreInfo({ id: moreInfoId }: MoreInfo) {
    return (
      (await db.surveyFiles
        .where({ moreInfoId })
        .and((r) => r.flag !== "d")
        .toArray()) ?? []
    );
  }

  static async getSignatureByType(
    projectId: number,
    signatureType: "engineer" | "customer",
  ) {
    const signatureTypeId = signatureType === "engineer" ? 1 : 2;
    return (
      (await db.surveyFiles.get({ projectId, signatureTypeId })) ??
      this.create({ projectId, signatureTypeId })
    );
  }

  static async getAllUpdated() {
    return getUpdatedItemsByTable(db.surveyFiles);
  }

  static async getAllDeleted() {
    return getDeletedItemsByTable(db.surveyFiles);
  }

  static async sync() {
    const surveyFiles = await SurveyFile.getAllUpdated();
    if (surveyFiles.length) {
      await Promise.all(
        surveyFiles.map(async (r) => {
          // Classes cannot be sent, so need to send File somehow.
          // maybe this saveFile only should activate after saving file initially
          await r.uploadFile();
          const savedFile = await saveFile(r.serializeWithoutFile());
          return r.syncFromServer(savedFile);
        }),
      );
    }
  }

  async uploadFile() {
    if (this.flag === "i") {
      const presignedURL = new URL("api/presigned", window.location.href);
      presignedURL.searchParams.set("fileName", this.file.name);
      presignedURL.searchParams.set("contentType", this.file.type);
      return fetch(presignedURL.toString())
        .then((res) => res.json())
        .then(async (res) => {
          const body = new Blob([this.file], {
            type: this.file.type,
          });
          await fetch(res.signedUrl, {
            body,
            method: "PUT",
          });
          this.url = res.signedUrl.split("?")[0];
        });
    }
  }

  async save() {
    return saveItem(this.db.surveyFiles, this);
  }

  async update(props: Partial<SurveyFile>) {
    return updateItem(this.db.surveyFiles, this.localId, props);
  }

  async delete() {
    return this.db.transaction(
      "rw",
      [this.db.surveyFiles, this.db.hardwares],
      () => {
        if (this.flag === "i" || this.flag === null) {
          this.db.surveyFiles.where({ id: this.id }).delete();
        } else {
          this.db.surveyFiles.where({ id: this.id }).modify({ flag: "d" });
        }

        this.db.hardwares.where({ rackId: this.id }).delete();
      },
    );
  }

  async syncFromServer({ id }: ServerFile) {
    return this.db.transaction(
      "rw",
      [this.db.surveyFiles, this.db.hardwares],
      () => {
        if (this.flag === "d") {
          this.db.surveyFiles.where({ localId: this.localId }).delete();
        } else {
          this.db.surveyFiles
            .where({ id: this.id })
            .modify({ id: id, flag: "o" });
        }
      },
    );
  }

  serializeBaseSurveyFile() {
    return {
      ...this.baseServerProps(),
      url: this.url,
      annotation: this.annotation,
    };
  }

  serializeWithoutFile() {
    return Object.assign({}, this, { file: undefined });
  }

  private baseServerProps() {
    return {
      ...shouldIncludeId(this.id, this.flag),
      flag: this.flag,
    };
  }

  private serializeQuestionResponseFile(): ServerQuestionResponseFile {
    return {
      ...this.baseServerProps(),
      questionResponseId: this.questionResponseId,
    };
  }

  private serializeRoomFile(): ServerRoomFile {
    return {
      ...this.baseServerProps(),
      roomId: this.roomId,
      isPlan: this.isPlan,
    };
  }

  private serializeRackFile(): ServerRackFile {
    return {
      ...this.baseServerProps(),
      rackId: this.rackId,
    };
  }

  private serializeMoreInfoFile(): ServerMoreInfoFile {
    return {
      ...this.baseServerProps(),
      moreInfoId: this.moreInfoId,
    };
  }

  private serializeSignatureFile(): ServerSignature {
    return {
      ...this.baseServerProps(),
      signatureTypeId: this.signatureTypeId,
    };
  }

  serialize() {
    if (this.questionResponseId) {
      return this.serializeQuestionResponseFile();
    } else if (this.roomId) {
      return this, this.serializeRoomFile();
    } else if (this.rackId) {
      return this.serializeRackFile();
    } else if (this.moreInfoId) {
      return this.serializeMoreInfoFile();
    } else {
      return this.serializeSignatureFile();
    }
  }
}
