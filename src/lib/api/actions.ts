"use server";

import sql from "./db";
import {
  DexieComment,
  DexieResponse,
  DexieResponseGroup,
  DexieResponseGroupedByResponseType,
} from "../types/dexie";
import { ResponseType } from "../types/question_new";
import {
  transformComment,
  transformResponseToServerResponse,
} from "../utils/functions";
import {
  ServerResponseTypes,
  ServerResponseGroup,
  ServerComment,
} from "../types/server_new";
import postgres from "postgres";

type ServerTableIndex = Exclude<ResponseType, "collection">;

export type TableByQuestionType = Record<ServerTableIndex, string>;
type ArrayTypesRelvin = ServerComment;

const tableByType: TableByQuestionType = {
  geo: "geo_question_response",
  checkbox: "checkbox_question_response",
  time: "time_question_response",
  datetime: "datetime_question_response",
  person: "person_question_response",
  email: "email_question_response",
  phone: "phone_question_response",
  days: "day_question_response",
  number: "number_question_response",
  "yes/no": "yes_no_question_response",
  text: "text_question_response",
  list: "text_question_response",
  multiple: "text_question_response",
};

const insertOrUpdate = async (
  sql: postgres.TransactionSql,
  serverTableIndex: ServerTableIndex,
  serverResponses: ServerResponseTypes[],
) => {
  return await sql`
    INSERT INTO ${sql(tableByType[serverTableIndex])} ${sql(serverResponses)}
    ON CONFLICT (id) 
    DO UPDATE SET
    ${Object.keys(serverResponses[0]).map(
      (x, i) => sql`${i ? sql`,` : sql``}${sql(x)} = excluded.${sql(x)}`,
    )}
    RETURNING *`;
};

const insertOrUpdateByTableName = async <K extends ArrayTypesRelvin>(
  sql: postgres.TransactionSql,
  serverTableName: string,
  serverResponses: ArrayTypesRelvin[],
) => {
  const result: K[] = await sql`
    INSERT INTO ${sql(serverTableName)} ${sql(serverResponses)}
    ON CONFLICT (id) 
    DO UPDATE SET
    ${Object.keys(serverResponses[0]).map(
      (x, i) => sql`${i ? sql`,` : sql``}${sql(x)} = excluded.${sql(x)}`,
    )}
    RETURNING *`;

  return result;
};

// export async function saveComments(comments: DexieComment[]) {
//   const result: Comment[] = await sql`INSERT INTO question_response ${sql(
//     comments,
//     "questionId",
//     "comment",
//     "responseGroupId",
//   )}
//   ON CONFLICT (question_id, response_group_id)
//   DO UPDATE SET
//     comment = EXCLUDED.comment
//     RETURNING *;`;

//   return result;
// }

export async function saveComments(comments: DexieComment[]) {
  const [commentsInserted, commentsUpdated] = await sql.begin(async (sql) => {
    const serverComments = comments.map(transformComment);
    const insertResponses = serverComments.filter((c) => !c.id);
    const updateResponses = serverComments.filter((c) => c.id);
    const inserted = insertResponses.length
      ? await insertOrUpdateByTableName(
          sql,
          "question_response",
          insertResponses,
        )
      : [];
    const updated = updateResponses.length
      ? await insertOrUpdateByTableName(
          sql,
          "question_response",
          updateResponses,
        )
      : [];

    return [inserted, updated];
  });

  return [commentsInserted, commentsUpdated];
}

export async function saveResponseGroup(responseGroup: DexieResponseGroup) {
  const result: ServerResponseGroup[] =
    await sql`INSERT INTO response_group ${sql(responseGroup, "collectionId")} 
    RETURNING *;`;

  return result;
}

/**
 * Inserts or modifies an entry based on ID existence
 * @param responses responses that need updating DexieResponse[]
 * @returns Array of sql statements to resolve with inserts and modifies separated
 **/
export async function saveResponses(responses: DexieResponse[]) {
  const groupedResponses: DexieResponseGroupedByResponseType = responses.reduce(
    function (r, a) {
      r[a.responseType] = r[a.responseType] || [];
      r[a.responseType].push(a);

      return r;
    },
    Object.create(null),
  );

  /**
   * SQL Transaction all statements should run in one trip to db
   */
  return await sql.begin(async (sql) => {
    const requests: Promise<postgres.RowList<postgres.Row[]>>[] = [];
    Object.entries(groupedResponses).forEach(([k, responses]) => {
      const serverResponses = responses.map(transformResponseToServerResponse);
      const insertResponses = serverResponses.filter((r) => !r.id);
      const updateResponses = serverResponses.filter((r) => r.id);
      insertResponses.length &&
        requests.push(
          insertOrUpdate(sql, k as ServerTableIndex, insertResponses),
        );
      updateResponses.length &&
        requests.push(
          insertOrUpdate(sql, k as ServerTableIndex, updateResponses),
        );
    });

    return requests;
  });
}
