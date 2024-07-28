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
  ServerHardware,
  ServerMoreInfo,
  ServerRack,
  ServerRoom,
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
      db.responses.bulkAdd(data.responses.map((r) => Response.deserialize(r)));
      db.comments.bulkAdd(data.comments.map((c) => Comment.deserialize(c)));
      db.rooms.bulkAdd(data.rooms.map((r) => Room.deserialize(r)));
      db.moreInfos.bulkAdd(
        data.moreInfos.map((mI) => MoreInfo.deserialize(mI)),
      );
      db.racks.bulkAdd(data.racks.map((r) => Rack.deserialize(r)));
      db.hardwares.bulkAdd(data.hardwares.map((h) => Hardware.deserialize(h)));
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

export const updateResponseGroupIds = (
  oldResponseGroupId: number,
  responseGroupId?: number,
) => {
  return db.transaction(
    "rw",
    [db.responseGroups, db.comments, db.responses],
    () => {
      db.responseGroups
        .where({ id: oldResponseGroupId })
        .modify({ id: responseGroupId, flag: null });
      db.comments
        .where({ responseGroupId: oldResponseGroupId })
        .modify({ responseGroupId });
      db.responses
        .where({ responseGroupId: oldResponseGroupId })
        .modify({ responseGroupId });
    },
  );
};

export const getComment = async (
  projectId?: number,
  question?: DexieQuestion,
) => {
  if (projectId && question) {
    return (
      (await db.comments.get({ projectId, questionId: question?.id })) ||
      Comment.fromQuestion(question)
    );
  }
};

export const addComments = async (comments?: Comment[]) => {
  return comments ? await db.comments.bulkAdd(comments) : [];
};

export const getResponse = (projectId?: number, question?: DexieQuestion) => {
  // TODO add when flag not equals d?
  if (projectId && question) {
    return db.responses
      .where({ projectId, questionId: question?.id })
      .and((r) => r.flag !== "d")
      .toArray();
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
  return [Response.fromQuestion(question)];
};

export const getRoomById = async (projectId: number, id?: number) =>
  id ? await db.rooms.get({ id }) : Room.fromProject(projectId);

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
) => table.where("flag").anyOf(["i", "u"]).toArray();

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

//TODO: investigate error
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
  return groupedResponses;
};

export const updateRoomIds = ({ id }: Room, { id: newId }: ServerRoom) => {
  return db.transaction("rw", [db.rooms, db.racks, db.moreInfos], () => {
    db.rooms.where({ id }).modify({ id: newId, flag: null });
    db.racks.where({ roomId: id }).modify({ roomId: newId });
    db.moreInfos.where({ roomId: id }).modify({ roomId: newId });
  });
};

export const updateRackIds = ({ id }: Rack, { id: newId }: ServerRack) => {
  return db.transaction("rw", [db.racks, db.hardwares], () => {
    db.racks.where({ id }).modify({ id: newId, flag: null });
    db.hardwares.where({ rackId: id }).modify({ rackId: newId });
  });
};

export const updateHardwareIds = (
  { id }: Hardware,
  { id: newId }: ServerHardware,
) => {
  return db.transaction("rw", [db.hardwares], () => {
    db.hardwares.where({ id }).modify({ id: newId, flag: null });
  });
};

export const updateMoreInfoIds = (
  { id }: MoreInfo,
  { id: newId }: ServerMoreInfo,
) => {
  return db.transaction("rw", [db.moreInfos], () => {
    db.moreInfos.where({ id }).modify({ id: newId, flag: null });
  });
};

// Delete
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
