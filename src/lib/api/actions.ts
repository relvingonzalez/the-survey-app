"use server";

import sql from "./db";
import {
  DexieComment,
  DexieHardware,
  DexieMoreInfo,
  DexieRack,
  DexieResponse,
  DexieResponseGroup,
  DexieResponseGroupedByResponseType,
  DexieRoom,
  DexieStructure,
  DexieTransformToServer,
} from "../types/dexie";
import {
  transformComment,
  transformHardware,
  transformMoreInfo,
  transformRack,
  transformResponseToServerResponse,
  transformRoom,
} from "../utils/functions";
import {
  ServerResponseGroup,
  ServerComment,
  ServerArray,
  ServerTableIndex,
  TableByQuestionType,
  ServerHardware,
} from "../types/server_new";
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

const insertOrUpdateItem = async <
  T extends DexieStructure,
  K extends ServerArray,
>(
  item: T,
  tableName: string,
  transformFunction: DexieTransformToServer<T, K>,
): Promise<K> => {
  const [serverRoom] = await insertOrUpdateByTableName<K>(sql, tableName, [
    transformFunction(item),
  ]);

  return serverRoom;
};

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
  return insertOrUpdateItem(room, "room", transformRoom);
  // const [serverRoom] = await sql.begin(async (sql) => {
  //   return await insertOrUpdateByTableName<ServerRoom>(sql, "room", [
  //     transformRoom(room),
  //   ]);
  // });

  // return serverRoom;
}

export async function saveRack(rack: DexieRack) {
  return insertOrUpdateItem(rack, "rack", transformRack);
}

export async function saveHardware(hardware: DexieHardware) {
  return insertOrUpdateItem(hardware, "hardware", transformHardware);
}

export async function saveMoreInfo(moreInfo: DexieMoreInfo) {
  return insertOrUpdateItem(moreInfo, "more_info", transformMoreInfo);
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

  const [responsesInserted, responsesUpdated] = await sql.begin(async (sql) => {
    const inserted: ServerArray[] = [];
    const updated: ServerArray[] = [];
    Object.entries(groupedResponses).forEach(async ([k, responses]) => {
      const serverResponses = responses.map(transformResponseToServerResponse);
      const insertResponses = serverResponses.filter((r) => !r.id);
      const updateResponses = serverResponses.filter((r) => r.id);

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

export async function saveHardwares(hardwares: DexieHardware[]) {
  const [hardwaresInserted, hardwaresUpdated] = await sql.begin(async (sql) => {
    const serverHardwares = hardwares.map(transformHardware);
    const insertResponses = serverHardwares.filter((h) => !h.id);
    const updateResponses = serverHardwares.filter((h) => h.id);
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
