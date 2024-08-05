import { db } from "./db";
import { ServerDownloadSiteData } from "../types/server";
import { EntityTable } from "dexie";
import {
  Question,
  DexieStructure,
  Response,
  Comment,
  Hardware,
  MoreInfo,
  Rack,
  Room,
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
      Question.bulkAdd(data.questions);
      Response.bulkAdd(data.responses);
      Comment.bulkAdd(data.comments);
      Room.bulkAdd(data.rooms);
      MoreInfo.bulkAdd(data.moreInfos);
      Rack.bulkAdd(data.racks);
      Hardware.bulkAdd(data.hardwares);
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
  return await db.responseGroups.where({ id }).modify({ flag: "d" });
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
