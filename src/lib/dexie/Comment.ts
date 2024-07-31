import { Entity } from "dexie";
import { ActionFlag } from "../types/dexie";
import { shouldIncludeId } from "../utils/functions";
import DexieObject from "./DexieObject";
import { TheSurveyAppDB } from "./TheSurveyAppDB";
import { db } from "./db";

export default class Comment extends Entity<TheSurveyAppDB> implements DexieObject<Comment> {
  localId!: number;
  tempId!: number;
  flag!: ActionFlag;
  id!: number;
  questionId!: number;
  projectId!: number;
  responseGroupId!: number;
  comment!: string;

  static async add({...props}: Partial<Comment>) {
    const comment = Object.create(Comment.prototype);
    Object.assign(comment, props);
    comment.flag = comment.id ? null : 'i';
    comment.comment = comment.comment ?? "";
    const addedId = await db.comments.add(comment);
    return db.comments.get(addedId);
  };

  static async bulkAdd(comments: Partial<Comment>[]) {
    return comments.map(this.add);
  }

  async delete() {
    return this.db.transaction("rw", this.db.comments, () => {
      if (this.flag === "i") {
        this.db.comments.where({ id: this.id }).delete();
      } else {
        this.db.comments.where({ id: this.id }).modify({ flag: "d" });
      }
    });
  }

  async save() {
    this.flag = ["i", null].includes(this.flag) ? "i" : "u";
    return await this.db.comments.put(this);
  }

  async update({...props}: Partial<Comment>) {
    return this.db.comments.update(this.localId, { ...props });
  }

  serialize() {
    return {
      ...shouldIncludeId(this.id, this.flag),
      questionId: this.questionId,
      comment: this.comment,
      responseGroupId: this.responseGroupId,
    };
  }
}
