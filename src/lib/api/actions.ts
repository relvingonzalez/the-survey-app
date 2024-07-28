"use server";

import sql from "./db";
import { DexieResponseGroupedByResponseType } from "../types/dexie";

import {
  ServerResponseGroup,
  ServerComment,
  ServerArray,
  ServerTableIndex,
  TableByQuestionType,
  ServerHardware,
  ServerRoom,
  ServerRack,
  ServerMoreInfo,
} from "../types/server";
import postgres from "postgres";

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
  sql: postgres.Sql,
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
  sql: postgres.Sql,
  serverTableIndex: ServerTableIndex,
  serverResponses: ServerArray[],
) =>
  insertOrUpdateByTableName<K>(
    sql,
    tableByType[serverTableIndex],
    serverResponses,
  );

const insertOrUpdateItem = async <K extends ServerArray>(
  item: K,
  tableName: string,
): Promise<K> => {
  const [inserted] = await insertOrUpdateByTableName<K>(sql, tableName, [item]);

  return inserted;
};

export async function saveComments(comments: ServerComment[]) {
  const [commentsInserted, commentsUpdated] = await sql.begin(async (sql) => {
    const insertResponses = comments.filter((c) => !c.id);
    const updateResponses = comments.filter((c) => c.id);
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

export async function saveRoom(room: ServerRoom) {
  return insertOrUpdateItem(room, "room");
}

export async function saveRack(rack: ServerRack) {
  return insertOrUpdateItem(rack, "rack");
}

export async function saveHardware(hardware: ServerHardware) {
  return insertOrUpdateItem(hardware, "hardware");
}

export async function saveMoreInfo(moreInfo: ServerMoreInfo) {
  return insertOrUpdateItem(moreInfo, "more_info");
}

export async function saveResponseGroup(responseGroup: ServerResponseGroup) {
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
export async function saveResponses(
  groupedResponses: DexieResponseGroupedByResponseType,
) {
  const [responsesInserted, responsesUpdated] = await sql.begin(async (sql) => {
    const inserted: ServerArray[] = [];
    const updated: ServerArray[] = [];
    Object.entries(groupedResponses).forEach(async ([k, responses]) => {
      const insertResponses = responses.filter((r) => !r.id);
      const updateResponses = responses.filter((r) => r.id);

      const insertedPromises = insertResponses.length
        ? await insertOrUpdateByTableIndex(
            sql,
            k as ServerTableIndex,
            insertResponses,
          )
        : [];

      const updatedPromises = updateResponses.length
        ? await insertOrUpdateByTableIndex(
            sql,
            k as ServerTableIndex,
            updateResponses,
          )
        : [];

      inserted.push(...insertedPromises);
      updated.push(...updatedPromises);
    });

    return [inserted, updated];
  });

  return [responsesInserted, responsesUpdated];
}

export async function saveHardwares(hardwares: ServerHardware[]) {
  const [hardwaresInserted, hardwaresUpdated] = await sql.begin(async (sql) => {
    const insertResponses = hardwares.filter((h) => !h.id);
    const updateResponses = hardwares.filter((h) => h.id);
    const inserted = insertResponses.length
      ? await insertOrUpdateByTableName<ServerHardware>(
          sql,
          "hardware",
          insertResponses,
        )
      : [];
    const updated = updateResponses.length
      ? await insertOrUpdateByTableName<ServerHardware>(
          sql,
          "hardware",
          updateResponses,
        )
      : [];

    return [inserted, updated];
  });

  return [hardwaresInserted, hardwaresUpdated];
}
