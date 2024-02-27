"use server";

import sql from "./db";
import { DexieComment } from "../types/dexie";
import { Comment } from "../types/question_new";

export async function saveComments(comments: DexieComment[]) {
  const result: Comment[] = await sql`INSERT INTO question_response ${sql(
    comments,
    "questionId",
    "comment",
    "collectionOrder",
  )} 
  ON CONFLICT(question_id) 
  DO UPDATE SET
    comment = EXCLUDED.comment,
    collection_order = EXCLUDED.collection_order
    RETURNING *;`;

  return result;
}
