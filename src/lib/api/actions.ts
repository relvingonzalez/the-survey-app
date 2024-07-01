"use server";

import sql from "./db";
import {
  DexieComment,
  DexieResponse,
  DexieResponseGroup,
} from "../types/dexie";
import { Comment, ResponseType } from "../types/question_new";
// import {
//   ServerCheckboxResponse,
//   ServerDateTimeResponse,
//   ServerDaysResponse,
//   ServerEmailResponse,
//   ServerGeoResponse,
//   ServerNumberResponse,
//   ServerPersonResponse,
//   ServerPhoneResponse,
//   ServerTextResponse,
//   ServerTimeResponse,
//   ServerYesNoResponse,
// } from "../types/server_new";
import { transformResponseToServerResponse } from "../utils/functions";
import { ServerResponseTypes } from "../types/server_new";
import postgres from "postgres";

type ServerTableIndex = Exclude<ResponseType, "collection">;

export type TableByQuestionType = Record<ServerTableIndex, string>;

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

export async function saveComments(comments: DexieComment[]) {
  const result: Comment[] = await sql`INSERT INTO question_response ${sql(
    comments,
    "questionId",
    "comment",
    "collectionOrder",
  )} 
  ON CONFLICT (question_id) 
  DO UPDATE SET
    comment = EXCLUDED.comment,
    collection_order = EXCLUDED.collection_order
    RETURNING *;`;

  return result;
}

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

/**
 * Inserts or modifies an entry based on ID existence
 * @param responses responses that need updating DexieResponse[]
 * @returns Array of sql statements to resolve with inserts and modifies separated
 **/
export async function saveResponses(responses: DexieResponse[]) {
  const groupedResponses: DexieResponseGroup = responses.reduce(function (
    r,
    a,
  ) {
    r[a.responseType] = r[a.responseType] || [];
    r[a.responseType].push(a);

    return r;
  }, Object.create(null));

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

    // This didn't work because inserts do not have ID but updates do,
    // and when mixing the two, it complained about undefined values
    // return Object.entries(groupedResponses).map(async ([k, responses]) => {
    //   const serverResponses = responses.map(transformResponseToServerResponse);
    //   // do two separate operations. Filter when id is defined and when id is undefined.
    //   return await sql`
    //       INSERT INTO ${sql(tableByType[k as ServerTableIndex])} ${sql(
    //         serverResponses,
    //       )}
    //       ON CONFLICT (id)
    //       DO UPDATE SET
    //       ${Object.keys(serverResponses[0]).filter((k) => k !== "id").map(
    //         (x, i) => sql`${i ? sql`,` : sql``}${sql(x)} = excluded.${sql(x)}`,
    //       )}
    //       RETURNING *`;
    // });
  });
}
