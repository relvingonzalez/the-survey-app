"use server";

import sql from "./db";
import {
  DexieComment,
  DexieResponse,
  DexieResponseGroup,
  DexieResponseGroupedByResponseType,
  DexieRoom,
} from "../types/dexie";
import { ResponseType } from "../types/question_new";
import {
  transformComment,
  transformResponseToServerResponse,
  transformRoom,
} from "../utils/functions";
import {
  ServerResponseTypes,
  ServerResponseGroup,
  ServerComment,
  ServerRoom,
} from "../types/server_new";
import postgres from "postgres";

type ServerTableIndex = Exclude<ResponseType, "collection">;

export type TableByQuestionType = Record<ServerTableIndex, string>;
type ServerArray = ServerComment | ServerRoom | ServerResponseTypes;

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

const insertOrUpdateByTableName = async <K extends ServerArray>(
  sql: postgres.TransactionSql,
  serverTableName: string,
  serverResponses: ServerArray[],
) => {
  const result: K[] = await sql<K[]>`
    INSERT INTO ${sql(serverTableName)} ${sql(serverResponses)}
    ON CONFLICT (id) 
    DO UPDATE SET
    ${Object.keys(serverResponses[0]).map(
      (x, i) => sql`${i ? sql`,` : sql``}${sql(x)} = excluded.${sql(x)}`,
    )}
    RETURNING *`;

  return result;
};

const insertOrUpdateByTableIndex = async <K extends ServerArray>(
  sql: postgres.TransactionSql,
  serverTableIndex: ServerTableIndex,
  serverResponses: ServerArray[],
) =>
  insertOrUpdateByTableName<K>(
    sql,
    tableByType[serverTableIndex],
    serverResponses,
  );

export async function saveComments(comments: DexieComment[]) {
  const [commentsInserted, commentsUpdated] = await sql.begin(async (sql) => {
    const serverComments = comments.map(transformComment);
    const insertResponses = serverComments.filter((c) => !c.id);
    const updateResponses = serverComments.filter((c) => c.id);
    const inserted = insertResponses.length
      ? await insertOrUpdateByTableName<ServerComment>(
          sql,
          "question_response",
          insertResponses,
        )
      : [];
    const updated = updateResponses.length
      ? await insertOrUpdateByTableName<ServerComment>(
          sql,
          "question_response",
          updateResponses,
        )
      : [];

    return [inserted, updated];
  });

  return [commentsInserted, commentsUpdated];
}

export async function saveRoom(room: DexieRoom) {
  const [serverRoom] = await sql.begin(async (sql) => {
    return await insertOrUpdateByTableName<ServerRoom>(sql, "room", [
      transformRoom(room),
    ]);
  });

  return serverRoom;
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
    const requests: Promise<ServerArray[]>[] = [];
    Object.entries(groupedResponses).forEach(([k, responses]) => {
      const serverResponses = responses.map(transformResponseToServerResponse);
      const insertResponses = serverResponses.filter((r) => !r.id);
      const updateResponses = serverResponses.filter((r) => r.id);
      insertResponses.length &&
        requests.push(
          insertOrUpdateByTableIndex(
            sql,
            k as ServerTableIndex,
            insertResponses,
          ),
        );
      updateResponses.length &&
        requests.push(
          insertOrUpdateByTableIndex(
            sql,
            k as ServerTableIndex,
            updateResponses,
          ),
        );
    });

    return requests;
  });
}
