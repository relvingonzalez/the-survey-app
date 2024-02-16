import { createMultipleResponse } from "@/components/Questions/QuestionTypes/QuestionMultiple";
import { DexieQuestion, DexieResponse } from "../types/dexie";
import { LocalDownloadSiteData } from "../types/local_new";
import { QuestionType } from "../types/question_new";
import { db } from "./db";
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

export const updateComment = (value: string, localId?: number) => {
  return db.transaction("rw", db.comments, () => {
    if (localId) {
      db.comments.where({ localId }).modify({ comment: value });
    }
  });
};

export const insertOrModifyResponse = (response: DexieResponse) => {
  if (response.localId) {
    if (response.flag === "d" && !response.id) {
      return db.responses.delete(response.localId);
    }
    return db.responses
      .where({ localId: response.localId })
      .modify({ ...response });
  }
  return db.responses.add(response);
};

export const insertOrModifyResponses = (responses: DexieResponse[]) => {
  return responses.map(insertOrModifyResponse);
};

export const getComment = (projectId?: number, question?: DexieQuestion) => {
  if (projectId && question) {
    return db.comments.get({ projectId, questionId: question?.id });
  }

  return undefined;
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

export const getCollectionQuestions = (
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
      .toArray();

    result = responses.reduce(function (r, a) {
      if (a.collectionOrder !== undefined) {
        r[a.collectionOrder] = r[a.collectionOrder] || [];
        r[a.collectionOrder].push(a);
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
