import {
  DexieComment,
  DexieHardware,
  DexieMoreInfo,
  DexieQuestion,
  DexieRack,
  DexieResponse,
  DexieRoom,
  DexieStructure,
  DexieTable,
} from "../types/dexie";
import { LocalDownloadSiteData } from "../types/local_new";
import { QuestionType } from "../types/question_new";
import { db } from "./db";
import { createMultipleResponse } from "@/components/Questions/QuestionTypes/QuestionMultiple";
import { createCheckboxResponse } from "@/components/Questions/QuestionTypes/QuestionCheckbox";
import { createDateTimeResponse } from "@/components/Questions/QuestionTypes/QuestionDateTime";
import { createEmailResponse } from "@/components/Questions/QuestionTypes/QuestionEmail";
import { createGeoResponse } from "@/components/Questions/QuestionTypes/QuestionGeo";
import { createListResponse } from "@/components/Questions/QuestionTypes/QuestionListSelect";
import { createNumberResponse } from "@/components/Questions/QuestionTypes/QuestionNumber";
import { createPersonResponse } from "@/components/Questions/QuestionTypes/QuestionPerson";
import { createPhoneResponse } from "@/components/Questions/QuestionTypes/QuestionPhone";
import { createTextResponse } from "@/components/Questions/QuestionTypes/QuestionText";
import { createTimeResponse } from "@/components/Questions/QuestionTypes/QuestionTime";
import { createYesNoResponse } from "@/components/Questions/QuestionTypes/QuestionYesNo";
import {
  ServerComment,
  ServerHardware,
  ServerMoreInfo,
  ServerRack,
  ServerRoom,
} from "../types/server_new";
import { createRoom, uniqueId } from "../utils/functions";
import { MoreInfo, Rack } from "../types/rooms";

export async function populate(data: LocalDownloadSiteData) {
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
      db.responses.bulkAdd(data.responses);
      db.comments.bulkAdd(data.comments);
      db.rooms.bulkAdd(data.rooms);
      db.moreInfos.bulkAdd(data.moreInfos);
      db.racks.bulkAdd(data.racks);
      db.hardwares.bulkAdd(data.hardwares);
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
  responses?: DexieResponse[],
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
        .modify({ id, flag: "" });

      db.responses
        .where({ questionId, responseGroupId })
        .modify({ questionResponseId: id, responseGroupId });
    });
  });
};

export const updateComment = (value: string, localId?: number) => {
  return db.transaction("rw", db.comments, () => {
    if (localId) {
      db.comments.where({ localId }).modify({ comment: value, flag: "u" });
    }
  });
};

export const updateResponseGroupIds = (
  oldResponseGroupId: number,
  responseGroupId: number,
) => {
  return db.transaction(
    "rw",
    [db.responseGroups, db.comments, db.responses],
    () => {
      db.responseGroups
        .where({ id: oldResponseGroupId })
        .modify({ id: responseGroupId, flag: "" });
      db.comments
        .where({ responseGroupId: oldResponseGroupId })
        .modify({ responseGroupId });
      db.responses
        .where({ responseGroupId: oldResponseGroupId })
        .modify({ responseGroupId });
    },
  );
};

// TODO replace with put instead of modify and add
export const insertOrModifyResponse = (response: DexieResponse) => {
  if (response.localId) {
    if (response.flag === "d" && !response.id) {
      return db.responses.delete(response.localId);
    }
    return db.responses
      .where({ localId: response.localId })
      .modify({ ...response, flag: response.flag || "u" });
  }
  return db.responses.add({ ...response, flag: "u" });
};

export const insertOrModifyResponses = (responses: DexieResponse[]) => {
  return responses.map(insertOrModifyResponse);
};

export const createComment = (
  questionId: number,
  projectId: number,
  id?: number,
  responseGroupId?: number,
): DexieComment => ({
  id,
  questionId,
  projectId,
  comment: "",
  responseGroupId,
  flag: "i",
});

export const getComment = async (
  projectId?: number,
  question?: DexieQuestion,
) => {
  if (projectId && question) {
    return (
      (await db.comments.get({ projectId, questionId: question?.id })) ||
      createComment(question?.id, projectId)
    );
  }
};

export const addComment = async (comment: DexieComment) => {
  return await db.comments.add(comment);
};

export const addComments = async (comments?: DexieComment[]) => {
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

export const addNewResponseGroup = async (
  id?: number,
  collectionId?: number,
  projectId?: number,
) => {
  return (
    collectionId &&
    id &&
    projectId &&
    (await db.responseGroups.add({ id, collectionId, projectId, flag: "u" }))
  );
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
  allResponses?: DexieResponse[],
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
  const response: DexieResponse[] = [];
  switch (question.responseType) {
    case "checkbox":
      response.push(createCheckboxResponse(question, ""));
      break;
    case "datetime":
      response.push(createDateTimeResponse(question));
      break;
    case "email":
      response.push(createEmailResponse(question));
      break;
    case "geo":
      response.push(createGeoResponse(question));
      break;
    case "list":
      response.push(createListResponse(question));
      break;
    case "multiple":
      response.push(createMultipleResponse(question, ""));
      break;
    case "number":
      response.push(createNumberResponse(question));
      break;
    case "person":
      response.push(createPersonResponse(question));
      break;
    case "phone":
      response.push(createPhoneResponse(question));
      break;
    case "text":
      response.push(createTextResponse(question));
      break;
    case "time":
      response.push(createTimeResponse(question));
      break;
    case "yes/no":
      response.push(createYesNoResponse(question));
      break;
  }
  return response;
};

export const getRoomById = async (projectId: number, id?: number) =>
  id ? await db.rooms.get({ id }) : createRoom(uniqueId(), projectId, "");

export const updateRoom = async ({ id, name, comment, flag }: DexieRoom) =>
  await db.rooms
    .where({ id })
    .modify({ name, comment, flag: flag !== "i" ? "u" : "i" });

export const deleteRoom = ({ id, flag }: DexieRoom) => {
  return db.transaction(
    "rw",
    [db.rooms, db.racks, db.moreInfos, db.hardwares],
    async () => {
      if (flag === "i") {
        // only local, delete everything
        db.rooms.where({ id }).delete();
      } else {
        // exists in server, set for deletion, and delete its accompanying data
        db.rooms.where({ id }).modify({ flag: "d" });
      }
      clearRoomTools(id);
    },
  );
};

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

export const saveRack = async (rack: Rack) => await db.racks.put(rack);

export const saveMoreInfo = async (moreInfo: MoreInfo) =>
  await db.moreInfos.put(moreInfo);

export const updateRack = async (rack: Rack) =>
  await db.racks.where({ id: rack.id }).modify(rack);

export const updateMoreInfo = async (moreInfo: MoreInfo) =>
  await db.moreInfos.where({ id: moreInfo.id }).modify(moreInfo);

// TODO: if deleting tools that have already been saved, don't delete instead mark with d flag
export const clearRoomTools = async (id: number) => {
  const racks = await db.racks.where({ roomId: id }).toArray();
  db.hardwares
    .where("rackId")
    .anyOf(racks.map((r) => r.id))
    .delete();
  db.racks.where({ roomId: id }).delete();
  db.moreInfos.where({ roomId: id }).delete();
};

export const getHardwareListByRackId = async (rackId: number) =>
  await db.hardwares
    .where({ rackId })
    .and((h) => h.flag !== "d")
    .toArray();

export const updateHardwareList = (hardwareList: DexieHardware[]) => {
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
  table: DexieTable<K>,
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

export const updateRoomIds = ({ id }: DexieRoom, { id: newId }: ServerRoom) => {
  return db.transaction("rw", [db.rooms, db.racks, db.moreInfos], () => {
    db.rooms.where({ id }).modify({ id: newId, flag: "" });
    db.racks.where({ roomId: id }).modify({ roomId: newId });
    db.moreInfos.where({ roomId: id }).modify({ roomId: newId });
  });
};

export const updateRackIds = ({ id }: DexieRack, { id: newId }: ServerRack) => {
  return db.transaction("rw", [db.racks, db.hardwares], () => {
    db.racks.where({ id }).modify({ id: newId, flag: "" });
    db.hardwares.where({ rackId: id }).modify({ rackId: newId });
  });
};

export const updateHardwareIds = (
  { id }: DexieHardware,
  { id: newId }: ServerHardware,
) => {
  return db.transaction("rw", [db.hardwares], () => {
    db.hardwares.where({ id }).modify({ id: newId, flag: "" });
  });
};

export const updateMoreInfoIds = (
  { id }: DexieMoreInfo,
  { id: newId }: ServerMoreInfo,
) => {
  return db.transaction("rw", [db.moreInfos], () => {
    db.moreInfos.where({ id }).modify({ id: newId, flag: "" });
  });
};
