import {
  DexieProcess,
  DexieProcessResponse,
  DexieQuestion,
  DexieQuestionResponse,
} from "../types/dexie";
import { LocalDownloadSiteData, LocalSiteProject } from "../types/local";
import { db } from "./db";

export async function populate(data: LocalDownloadSiteData) {
  return db.transaction(
    "rw",
    [
      db.siteProjects,
      db.questions,
      db.processes,
      db.rackQuestions,
      db.questionResponses,
      db.processResponses,
      db.rackQuestionResponses,
      db.rooms,
      db.moreInfos,
      db.racks,
      db.hardwares,
    ],
    () => {
      db.siteProjects.add(data.siteProject);
      db.questions.bulkAdd(data.questions);
      db.processes.bulkAdd(data.processes);
      db.rackQuestions.bulkAdd(data.rackQuestions);
      db.questionResponses.bulkAdd(data.questionResponses);
      db.processResponses.bulkAdd(data.processResponses);
      db.rackQuestionResponses.bulkAdd(data.rackQuestionResponses);
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
      db.processes,
      db.rackQuestions,
      db.questionResponses,
      db.processResponses,
      db.rackQuestionResponses,
      db.rooms,
      db.moreInfos,
      db.racks,
      db.hardwares,
    ],
    () => {
      db.siteProjects.where({ projectId }).delete();
      db.questions.where({ projectId }).delete();
      db.processes.where({ projectId }).delete();
      db.rackQuestions.where({ projectId }).delete();
      db.questionResponses.where({ projectId }).delete();
      db.processResponses.where({ projectId }).delete();
      db.rackQuestionResponses.where({ projectId }).delete();
      db.rooms.where({ projectId }).delete();
      db.moreInfos.where({ projectId }).delete();
      db.racks.where({ projectId }).delete();
      db.hardwares.where({ projectId }).delete();
    },
  );
}

export function getNextUnansweredQuestion(
  site?: LocalSiteProject,
  questions?: DexieQuestion[],
  questionResponses?: DexieQuestionResponse[],
) {
  const unansweredQuestion = questions?.find((q) => {
    const res = questionResponses?.find((qR) => qR.questionId === q.id);
    return !res || !res.response;
  });

  return unansweredQuestion || (questions && questions[0]);
}

export function getNextUnansweredProcess(
  site?: LocalSiteProject,
  processes?: DexieProcess[],
  processResponses?: DexieProcessResponse[],
) {
  const unansweredProcess = processes?.find((q) => {
    const res = processResponses?.find((pR) => pR.processId === q.id);
    return !res || !res.response;
  });

  return unansweredProcess || (processes && processes[0]);
}
