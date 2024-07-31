import { Entity } from "dexie";
import { ActionFlag } from "../types/dexie";
import { shouldIncludeId, uniqueId } from "../utils/functions";
import { db } from "./db";
import DexieObject from "./DexieObject";
import { TheSurveyAppDB } from "./TheSurveyAppDB";

export default class ResponseGroup extends Entity<TheSurveyAppDB> implements DexieObject<ResponseGroup> {
  localId!: number;
  flag!: ActionFlag;
  id!: number;
  collectionId!: number;
  projectId!: number;

  static async add({...props}: Partial<ResponseGroup>) {
    const responseGroup = Object.create(Comment.prototype);
    Object.assign(responseGroup, props);
    responseGroup.id = responseGroup.id || uniqueId();
    responseGroup.flag = "i";
    const addedId = await db.responseGroups.add(responseGroup);
    return db.responseGroups.get(addedId);
  };

  async delete() {
    return db.transaction(
      "rw",
      [db.responseGroups, db.comments, db.responses],
      () => {
        if (this.flag === "i") {
          db.responseGroups.where({ id: this.id }).delete();
        } else {
          db.responseGroups.where({ id: this.id }).modify({ flag: "d" });
        }
        db.comments.where({ responseGroupId: this.id }).delete();
        db.responses.where({ responseGroupId: this.id }).delete();
      },
    );
  }

  async update(props: Partial<ResponseGroup>) {
    return await db.responseGroups.update(this.localId, {
      ...props,
    });
  }

  async save() {
    this.flag = ["i", null].includes(this.flag) ? "i" : "u";
    return await db.responseGroups.put(this);
  }

  serialize() {
    return {
      ...shouldIncludeId(this.id, this.flag),
      flag: this.flag,
      collectionId: this.collectionId,
    };
  }
}
