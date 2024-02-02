import { LocalDownloadSiteData } from "../types/local";
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
