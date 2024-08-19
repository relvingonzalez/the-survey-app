import { db } from "./db";
import { ServerDownloadSiteData } from "../types/server";
import { EntityTable, IDType, InsertType, UpdateSpec } from "dexie";
import {
  Question,
  DexieStructure,
  Response,
  Comment,
  Hardware,
  MoreInfo,
  Rack,
  Room,
  ResponseGroup,
  uniqueId,
} from "../../../internal";
export async function populate(data: ServerDownloadSiteData) {
  return db.transaction(
    "rw",
    [
      db.siteProjects,
      db.questions,
      db.responses,
      db.comments,
      db.rooms,
      db.moreInfos,
      db.racks,
      db.hardwares,
    ],
    () => {
      db.siteProjects.add(data.siteProject);
      Question.bulkAddFromServer(data.questions);
      Response.bulkAddFromServer(data.responses);
      Comment.bulkAddFromServer(data.comments);
      Room.bulkAddFromServer(data.rooms);
      MoreInfo.bulkAddFromServer(data.moreInfos);
      Rack.bulkAddFromServer(data.racks);
      Hardware.bulkAddFromServer(data.hardwares);
    },
  );
}

export async function deleteProject(projectId: number) {
  return db.transaction(
    "rw",
    [
      db.siteProjects,
      db.questions,
      db.responses,
      db.comments,
      db.rooms,
      db.moreInfos,
      db.racks,
      db.hardwares,
      db.responseGroups,
    ],
    () => {
      db.siteProjects.where({ projectId }).delete();
      db.questions.where({ projectId }).delete();
      db.responses.where({ projectId }).delete();
      db.comments.where({ projectId }).delete();
      db.rooms.where({ projectId }).delete();
      db.moreInfos.where({ projectId }).delete();
      db.racks.where({ projectId }).delete();
      db.hardwares.where({ projectId }).delete();
      db.responseGroups.where({ projectId }).delete();
    },
  );
}

export const deleteResponseGroup = async (id: number) => {
  const currentResponseGroup = await db.responseGroups.get({ id });
  return currentResponseGroup
    ? db.responseGroups.where({ id }).modify({ flag: "d" })
    : ResponseGroup.add({ id, flag: "d" });
};

export const questionResponsesCounts = (
  allQuestions?: Question[],
  allResponses?: Response[],
) => {
  const questions = allQuestions?.filter((q) => q.questionType === "question");
  const processes = allQuestions?.filter((q) => q.questionType === "process");
  const questionsCount = questions?.length;
  const processesCount = processes?.length;
  const questionResponsesCount = questions?.filter(
    (q) => allResponses?.find((r) => q.id === r.questionId),
  ).length;
  const processResponsesCount = processes?.filter(
    (q) => allResponses?.find((r) => q.id === r.questionId),
  ).length;

  return {
    questionsCount,
    processesCount,
    questionResponsesCount,
    processResponsesCount,
  };
};

// Get Updated items which means either insert or update
export const getUpdatedItemsByTable = <K extends DexieStructure>(
  table: EntityTable<K, "localId">,
) => table.where("flag").anyOf(["i", "u", "d"]).toArray();

// Get Deleted
export const getDeletedItemsByTable = <K extends DexieStructure>(
  table: EntityTable<K, "localId">,
) => table.where({ flag: "d" }).toArray();

// Get Deleted
export const addItem = async <K extends DexieStructure>(
  table: EntityTable<K, "localId">,
  item: K,
) => {
  const addedId = await table.add(item);
  return table.get(addedId);
};

export const addItemsFromServer = <K extends DexieStructure>(
  addFn: (item: Partial<K>) => Promise<K | undefined>,
  items: Partial<K>[],
) => {
  return items.map((v) => addFn({ ...v, flag: "o" }));
};

export const addItems = <K extends DexieStructure>(
  addFn: (item: Partial<K>) => Promise<K | undefined>,
  items: Partial<K>[],
) => {
  return items.map(addFn);
};

export const createItem = <K extends DexieStructure>(
  item: K,
  props: Partial<K>,
) => {
  const response: K = Object.create(item);
  Object.assign(response, props);
  response.id = response.id ?? uniqueId();
  response.flag = response.flag ?? "i";
  return response;
};

export const saveItem = <K extends DexieStructure>(
  table: EntityTable<K, "localId">,
  item: K,
) => {
  return table.put({
    ...item,
    flag: ["i", null].includes(item.flag) ? "i" : "u",
  });
};

export const updateItem = <K extends DexieStructure>(
  table: EntityTable<K, "localId">,
  localId: IDType<K, "localId">,
  props: UpdateSpec<InsertType<K, "localId">>,
) => {
  return table.update(localId, props);
};
