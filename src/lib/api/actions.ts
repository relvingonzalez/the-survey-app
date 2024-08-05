"use server";

import sql from "./db";
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
import { DexieResponseGroupedByResponseType } from "../../../internal";

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
    ${Object.keys(serverResponses[0])
      .filter((k) => k !== "flag")
      .map((x, i) => sql`${i ? sql`,` : sql``}${sql(x)} = excluded.${sql(x)}`)}
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

const deleteByTableName = async <K extends ServerArray>(
  sql: postgres.Sql,
  serverTableName: string,
  serverResponses: ServerArray[],
) => {
  // TODO: Figure out how to make this better. Shouldn't have to specify 0. Maybe fix typescript. If updated or deleted it will have an id.
  return sql<K[]>`
    DELETE FROM ${sql(serverTableName)} WHERE id IN ${sql(
      serverResponses.map((r) => r.id || 0),
    )} RETURNING *;`;
};

const deleteByTableIndex = <K extends ServerArray>(
  sql: postgres.Sql,
  serverTableIndex: ServerTableIndex,
  serverResponses: ServerArray[],
) => deleteByTableName<K>(sql, tableByType[serverTableIndex], serverResponses);

const deleteItem = async <K extends ServerArray>(
  item: K,
  tableName: string,
) => {
  const [inserted] = await deleteByTableName<K>(sql, tableName, [item]);

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
  return room.flag === "d"
    ? deleteItem(room, "room")
    : insertOrUpdateItem(room, "room");
}

export async function saveRack(rack: ServerRack) {
  return rack.flag === "d"
    ? deleteItem(rack, "rack")
    : insertOrUpdateItem(rack, "rack");
}

export async function saveHardware(hardware: ServerHardware) {
  return hardware.flag === "d"
    ? deleteItem(hardware, "hardware")
    : insertOrUpdateItem(hardware, "hardware");
}

export async function saveMoreInfo(moreInfo: ServerMoreInfo) {
  return moreInfo.flag === "d"
    ? deleteItem(moreInfo, "moreInfo")
    : insertOrUpdateItem(moreInfo, "more_info");
}

export async function saveResponseGroup(responseGroup: ServerResponseGroup) {
  const result: ServerResponseGroup[] =
    await sql`INSERT INTO response_group ${sql(responseGroup, "collectionId")} 
    RETURNING *;`;

  return result;
}

export async function saveComment(comment: ServerComment) {
  return insertOrUpdateItem(comment, "question_response");
}

/**
 * Inserts or modifies an entry based on ID existence
 * @param responses responses that need updating DexieResponse[]
 * @returns Array of sql statements to resolve with inserts and modifies separated
 **/
export async function saveResponses(
  groupedResponses: DexieResponseGroupedByResponseType,
) {
  const [responsesInserted, responsesUpdated, responsesDeleted] =
    await sql.begin(async (sql) => {
      const inserted: ServerArray[] = [];
      const updated: ServerArray[] = [];
      const deleted: ServerArray[] = [];
      Object.entries(groupedResponses).forEach(async ([k, responses]) => {
        const insertResponses = responses.filter((r) => r.flag === "i");
        const updateResponses = responses.filter((r) => r.flag === "u");
        const deletedResponses = responses.filter((r) => r.flag === "d");

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

        const deletedPromises = deletedResponses.length
          ? await deleteByTableIndex(
              sql,
              k as ServerTableIndex,
              deletedResponses,
            )
          : [];

        inserted.push(...insertedPromises);
        updated.push(...updatedPromises);
        deleted.push(...deletedPromises);
      });

      return [inserted, updated, deleted];
    });

  return [responsesInserted, responsesUpdated, responsesDeleted];
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
