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
      db.rooms.bulkAdd(data.rooms);
      db.moreInfos.bulkAdd(data.moreInfos);
      db.racks.bulkAdd(data.racks);
      db.hardwares.bulkAdd(data.hardwares);
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
