import { Entity } from "dexie";
import DexieObject from "./DexieObject";
import { ServerComment } from "../types/server";
import { saveComment } from "../api/actions";
import {
  ActionFlag,
  addItem,
  addItems,
  addItemsFromServer,
  createItem,
  db,
  getDeletedItemsByTable,
  getUpdatedItemsByTable,
  type Question,
  saveItem,
  shouldIncludeId,
  type TheSurveyAppDB,
  updateItem,
} from "../../../internal";

export class Comment
  extends Entity<TheSurveyAppDB>
  implements DexieObject<Comment>
{
  localId!: number;
  tempId!: number;
  flag!: ActionFlag;
  id!: number;
  questionId!: number;
  projectId!: number;
  responseGroupId!: number;
  comment!: string;

  // static create({ ...props }: Partial<Comment>) {
  //   const comment = Object.create(Comment.prototype);
  //   Object.assign(comment, props);
  //   comment.flag = comment.id ? null : "i";
  //   comment.comment = comment.comment ?? "";
  //   return comment;
  // }

  // static async add({ ...props }: Partial<Comment>) {
  //   const comment = Comment.create(props);
  //   const addedId = await db.comments.add(comment);
  //   return db.comments.get(addedId);
  // }

  // static async bulkAdd(comments: Partial<Comment>[]) {
  //   return comments.map(Comment.add);
  // }

  static create({ ...props }: Partial<Comment>) {
    return createItem(Comment.prototype, props);
  }

  static add({ ...props }: Partial<Comment>) {
    return addItem(db.comments, Comment.create(props));
  }

  static async bulkAdd(comments: Partial<Comment>[]) {
    return addItems(Comment.add, comments);
  }

  static async bulkAddFromServer(comments: Partial<Comment>[]) {
    return addItemsFromServer(Comment.add, comments);
  }

  static async getAllUpdated() {
    return getUpdatedItemsByTable(db.comments);
  }

  static async getAllDeleted() {
    return getDeletedItemsByTable(db.comments);
  }

  static async getFromQuestion({ projectId, id: questionId }: Question) {
    return (
      (await db.comments.get({
        projectId,
        questionId,
      })) || Comment.add({ projectId, questionId })
    );
  }

  static async sync() {
    const comments = await Comment.getAllUpdated();
    if (comments.length) {
      await Promise.all(
        comments.map(async (c) => {
          const savedComment = await saveComment(c.serialize());
          return c.syncFromServer(savedComment);
        }),
      );
    }
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
    return saveItem(this.db.comments, this);
  }

  async update(props: Partial<Comment>) {
    return updateItem(this.db.comments, this.localId, props);
  }

  async syncFromServer({ id, questionId, responseGroupId }: ServerComment) {
    return this.db.transaction(
      "rw",
      [this.db.comments, this.db.responses],
      () => {
        this.db.comments
          .where({ localId: this.localId })
          .modify({ id, flag: "o" });

        this.db.responses
          .where({ questionId, responseGroupId })
          .modify({ questionResponseId: id });
      },
    );
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
