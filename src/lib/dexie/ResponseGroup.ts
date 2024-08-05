import { Entity } from "dexie";
import { ServerResponseGroup } from "../types/server";
import DexieObject from "./DexieObject";
import { saveResponseGroup } from "../api/actions";
import {
  ActionFlag,
  db,
  getDeletedItemsByTable,
  getUpdatedItemsByTable,
  shouldIncludeId,
  type TheSurveyAppDB,
  uniqueId,
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

  static async add({ ...props }: Partial<ResponseGroup>) {
    const responseGroup = Object.create(ResponseGroup.prototype);
    Object.assign(responseGroup, props);
    responseGroup.id = responseGroup.id ?? uniqueId();
    responseGroup.flag = "i";
    const addedId = await db.responseGroups.add(responseGroup);
    return db.responseGroups.get(addedId);
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
          const [savedResponseGroup] = await saveResponseGroup(r.serialize());
          return r.syncFromServer(savedResponseGroup);
        }),
      );
    }
  }

  async delete() {
    return this.db.transaction(
      "rw",
      [this.db.responseGroups, this.db.comments, this.db.responses],
      () => {
        if (this.flag === "i") {
          this.db.responseGroups.where({ id: this.id }).delete();
        } else {
          this.db.responseGroups.where({ id: this.id }).modify({ flag: "d" });
        }
        this.db.comments.where({ responseGroupId: this.id }).delete();
        this.db.responses.where({ responseGroupId: this.id }).delete();
      },
    );
  }

  async update(props: Partial<ResponseGroup>) {
    return await this.db.responseGroups.update(this.localId, {
      ...props,
    });
  }

  async save() {
    this.flag = ["i", null].includes(this.flag) ? "i" : "u";
    return await this.db.responseGroups.put(this);
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
            .modify({ id: responseGroupId, flag: null });
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
