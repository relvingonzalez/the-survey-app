import {
  DexieQuestion,
  DexieResponse,
  DexieResponseGroupedByResponseType,
  DexieStructure,
} from "../types/dexie";
import { QuestionType } from "../types/question";
import { db } from "./db";
import {
  ServerComment,
  ServerDownloadSiteData,
} from "../types/server";
import Hardware from "./Hardware";
import MoreInfo from "./MoreInfo";
import Response from "./Response";
import Comment from "./Comment";
import Rack from "./Rack";
import Room from "./Room";
import { EntityTable } from "dexie";

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
      db.questions.bulkAdd(data.questions);
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

export function getNextUnansweredQuestion(
  questions?: DexieQuestion[],
  responses?: Response[],
) {
  return (
    questions?.find((q) => !responses?.find((r) => r.questionId === q.id)) ||
    (questions && questions[0])
  );
}

export const getPrevQuestion = async (
  projectId: number,
  questionType: QuestionType,
  question?: DexieQuestion,
) => {
  if (question) {
    const questions = await db.questions
      .where({ projectId, questionType })
      .sortBy("order");
    const currentIndex = questions.findIndex((q) => q.id === question.id);
    return currentIndex > 0 ? questions[currentIndex - 1] : undefined;
  }
  return undefined;
};

export const getNextQuestion = async (
  projectId: number,
  questionType: QuestionType,
  question?: DexieQuestion,
) => {
  if (question) {
    const questions = await db.questions
      .where({ projectId, questionType })
      .sortBy("order");
    const currentIndex = questions.findIndex((q) => q.id === question.id);
    return currentIndex < questions.length
      ? questions[currentIndex + 1]
      : undefined;
  }
  return undefined;
};

export const updateCommentIds = (comments: ServerComment[]) => {
  return db.transaction("rw", [db.comments, db.responses], () => {
    comments.map(({ id, questionId, responseGroupId }) => {
      db.comments
        .where({ questionId, responseGroupId })
        .modify({ id, flag: null });

      db.responses
        .where({ questionId, responseGroupId })
        .modify({ questionResponseId: id });
    });
  });
};

export const getComment = async (
  projectId?: number,
  question?: DexieQuestion,
) => {
  if (projectId && question) {
    return (
      (await db.comments.get({ projectId, questionId: question?.id })) ||
      Comment.add(question)
    );
  }
};

export const getResponse = async (projectId?: number, question?: DexieQuestion) => {
  if (projectId && question) {
    const response = await db.responses
      .where({ projectId, questionId: question?.id })
      .and((r) => r.flag !== "d")
      .toArray();
    
    return response.length ? response : [Response.create({ projectId, questionId: question.id, responseType: question.responseType })];
  }

  return [];
};

export const getMainQuestions = (
  projectId?: number,
  questionType?: QuestionType,
) => {
  // Only return main questions filter out questions that belong to a collection
  if (projectId && questionType) {
    return db.questions
      .where({ projectId, questionType })
      .filter((q) => q.collectionId === null || q.responseType === "collection")
      .sortBy("order");
  }

  return [];
};

export const getCollectionQuestions = async (
  projectId?: number,
  collectionId?: number,
) => {
  // Only return main questions filter out questions that belong to a collection
  if (projectId && collectionId) {
    return db.questions
      .where({ projectId, collectionId })
      .filter((q) => q.responseType !== "collection")
      .sortBy("order");
  }

  return [];
};

export const deleteResponseGroup = async (id: number) => {
  return await db.responseGroups.where({ id }).modify({ flag: "d" });
};

export const getCollectionResponses = async (
  questions?: DexieQuestion[],
): Promise<Record<number, DexieResponse[]>> => {
  // groupBy groupId or whatever
  let result = {};
  if (questions) {
    const ids = questions.map((q) => q.id);
    const responses = await db.responses
      .where("questionId")
      .anyOf(ids)
      .and((r) => r.flag !== "d")
      .sortBy("responseGroupId");

    result = responses.reduce(function (r, a) {
      if (a.responseGroupId !== undefined) {
        r[a.responseGroupId] = r[a.responseGroupId] || [];
        r[a.responseGroupId].push(a);
      }

      return r;
    }, Object.create(null));
  }

  return result;
};

export const questionResponsesCounts = (
  allQuestions?: DexieQuestion[],
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

export const createResponseByQuestion = (
  question: DexieQuestion,
): DexieResponse[] => {
  return [Response.create(question)];
};

export const getRoomById = async (projectId: number, id?: number) =>
  id ? await db.rooms.get({ id }) : Room.add({ projectId });

export const getMoreInfosByRoomId = async (roomId: number) =>
  await db.moreInfos
    .where({ roomId })
    .and((mI) => mI.flag !== "d")
    .toArray();

export const getRacksByRoomId = async (roomId: number) =>
  await db.racks
    .where({ roomId })
    .and((r) => r.flag !== "d")
    .toArray();

export const getHardwareListByRackId = async (rackId: number) =>
  await db.hardwares
    .where({ rackId })
    .and((h) => h.flag !== "d")
    .toArray();

export const updateHardwareList = (hardwareList: Hardware[]) => {
  return db.transaction("rw", db.hardwares, async () => {
    // If new list does not have one that existed, either edit the flag to d if old, or delete it if new
    db.hardwares
      .where("id")
      .noneOf(hardwareList.map((h) => h.id))
      .and((h) => h.flag === "i")
      .delete();
    db.hardwares
      .where("id")
      .noneOf(hardwareList.map((h) => h.id))
      .and((h) => h.flag !== "i")
      .modify({ flag: "d" });
    // If new list has one that didn't exist, put
    db.hardwares.bulkPut(hardwareList);
  });
};

// Get Updated items which means either insert or update
const getUpdatedItemsByTable = <K extends DexieStructure>(
  table: EntityTable<K, "localId">,
) => table.where("flag").anyOf(["i", "u", "d"]).toArray();

export const getUpdatedRooms = async () => getUpdatedItemsByTable(db.rooms);

export const getUpdatedComments = async () =>
  getUpdatedItemsByTable(db.comments);

export const getUpdatedResponses = async () =>
  getUpdatedItemsByTable(db.responses);

export const getUpdatedResponseGroups = async () =>
  getUpdatedItemsByTable(db.responseGroups);

export const getUpdatedRacks = async () => getUpdatedItemsByTable(db.racks);

export const getUpdatedMoreInfos = async () =>
  getUpdatedItemsByTable(db.moreInfos);

export const getUpdatedHardwares = async () =>
  getUpdatedItemsByTable(db.hardwares);

export const getGroupedUpdatedAndSerializedResponses = async () => {
  const responses = await getUpdatedResponses();
  const groupedResponses = responses.reduce<DexieResponseGroupedByResponseType>(
    function (r, a) {
      r[a.responseType] = r[a.responseType] || [];
      r[a.responseType].push(a.serialize());

      return r;
    },
    {},
  );

  console.log(groupedResponses);
  return groupedResponses;
};

// Get Deleted
const getDeletedItemsByTable = <K extends DexieStructure>(
  table: EntityTable<K, "localId">,
) => table.where({ flag: "d" }).toArray();

export const getDeletedResponseGroups = async () =>
  getDeletedItemsByTable(db.responseGroups);

export const getDeletedRacks = async () => getDeletedItemsByTable(db.racks);

export const getDeletedMoreInfos = async () =>
  getDeletedItemsByTable(db.moreInfos);

export const getDeletedHardwares = async () =>
  getDeletedItemsByTable(db.hardwares);

export const getDeletedRooms = async () => getDeletedItemsByTable(db.rooms);
