import { Entity } from "dexie";
import { ServerResponseGroup } from "../types/server";
import DexieObject from "./DexieObject";
import { saveResponseGroup } from "../api/actions";
import {
  ActionFlag,
  addItem,
  addItems,
  addItemsFromServer,
  createItem,
  db,
  getDeletedItemsByTable,
  getUpdatedItemsByTable,
  saveItem,
  shouldIncludeId,
  updateItem,
  type TheSurveyAppDB,
} from "../../../internal";
export class ResponseGroup
  extends Entity<TheSurveyAppDB>
  implements DexieObject<ResponseGroup>
{
  localId!: number;
  flag!: ActionFlag;
  id!: number;
  collectionId!: number;
  projectId!: number;

  static create({ ...props }: Partial<ResponseGroup>) {
    return createItem(ResponseGroup.prototype, props);
  }

  static add({ ...props }: Partial<ResponseGroup>) {
    return addItem(db.responseGroups, ResponseGroup.create(props));
  }

  static async bulkAdd(responseGroups: Partial<ResponseGroup>[]) {
    return addItems(ResponseGroup.add, responseGroups);
  }

  static async bulkAddFromServer(responseGroups: Partial<ResponseGroup>[]) {
    return addItemsFromServer(ResponseGroup.add, responseGroups);
  }

  static async getAllUpdated() {
    return getUpdatedItemsByTable(db.responseGroups);
  }

  static async getAllDeleted() {
    return getDeletedItemsByTable(db.responseGroups);
  }

  static async sync() {
    const responseGroups = await ResponseGroup.getAllUpdated();
    if (responseGroups.length) {
      await Promise.all(
        responseGroups.map(async (r) => {
          const savedResponseGroup = await saveResponseGroup(r.serialize());
          return r.syncFromServer(savedResponseGroup);
        }),
      );
    }
  }

  async save() {
    return saveItem(this.db.responseGroups, this);
  }

  async update(props: Partial<ResponseGroup>) {
    return updateItem(this.db.responseGroups, this.localId, props);
  }
  async delete() {
    return this.db.transaction(
      "rw",
      [this.db.responseGroups, this.db.comments, this.db.responses],
      () => {
        if (this.flag === "i" || this.flag === null) {
          this.db.responseGroups.where({ id: this.id }).delete();
        } else {
          this.db.responseGroups.where({ id: this.id }).modify({ flag: "d" });
        }
        this.db.comments.where({ responseGroupId: this.id }).delete();
        this.db.responseGroups.where({ responseGroupId: this.id }).delete();
      },
    );
  }

  async syncFromServer({ id: responseGroupId }: ServerResponseGroup) {
    return this.db.transaction(
      "rw",
      [this.db.responseGroups, this.db.comments, this.db.responses],
      () => {
        if (this.flag === "d") {
          this.db.responseGroups.where({ localId: this.localId }).delete();
        } else {
          this.db.responseGroups
            .where({ id: this.id })
            .modify({ id: responseGroupId, flag: "o" });
          this.db.comments
            .where({ responseGroupId: this.id })
            .modify({ responseGroupId });
          this.db.responses
            .where({ responseGroupId: this.id })
            .modify({ responseGroupId });
        }
      },
    );
  }

  serialize() {
    return {
      ...shouldIncludeId(this.id, this.flag),
      flag: this.flag,
      collectionId: this.collectionId,
    };
  }
}
