import { ActionFlag, DexieQuestion } from "../types/dexie";
import { ServerComment } from "../types/server";
import { shouldIncludeId, uniqueId } from "../utils/functions";
import { db } from "./db";

export default class Comment {
  localId!: number;
  tempId!: number;
  flag!: ActionFlag;
  id!: number;
  questionId!: number;
  projectId!: number;
  responseGroupId!: number;
  comment!: string;

  constructor({ ...props }: Partial<Comment>) {
    Object.assign(this, props);
    this.id = this.id || uniqueId();
    this.flag = this.flag || "i";
  }

  static deserialize({ ...serverProps }: ServerComment) {
    return new Comment({ ...serverProps, flag: "o" });
  }

  static fromQuestion(
    { projectId, id }: DexieQuestion,
    responseGroupId?: number,
  ) {
    const comment = new Comment({ projectId, questionId: id });
    comment.flag = "i";
    comment.comment = "";
    if (responseGroupId) {
      comment.responseGroupId = responseGroupId;
    }
    return comment;
  }

  async delete() {
    return db.transaction("rw", db.comments, () => {
      if (this.flag === "i") {
        db.comments.where({ id: this.id }).delete();
      } else {
        db.comments.where({ id: this.id }).modify({ flag: "d" });
      }
    });
  }

  async save() {
    this.flag = this.flag === "i" ? "i" : "u";
    return await db.comments.put(this);
  }

  async update(value: string) {
    this.comment = value;
    this.save();
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
