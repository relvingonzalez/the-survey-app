import { ActionFlag } from "../types/dexie";
import { shouldIncludeId, uniqueId } from "../utils/functions";
import { db } from "./db";

export default class ResponseGroup {
  localId!: number;
  flag!: ActionFlag;
  id!: number;
  collectionId!: number;
  projectId!: number;

  constructor({ ...props }: Partial<ResponseGroup>) {
    Object.assign(this, props);
    this.id = this.id || uniqueId();
    this.flag = this.flag || "i";
  }

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

  async update(responseGroup: Partial<ResponseGroup>) {
    return await db.responseGroups.update(this.localId, {
      ...responseGroup,
    });
  }

  async save() {
    this.flag = this.flag === "i" ? "i" : "u";
    return await db.responseGroups.put(this);
  }

  serialize() {
    return {
      ...shouldIncludeId(this.id, this.flag),
      collectionId: this.collectionId,
    };
  }
}
