import { LocalDownloadSiteData } from "../types/local";
import { db } from "./db";

export async function populate(data: LocalDownloadSiteData) {
  await db.siteProjects.add(data.siteProject);
  await db.questions.bulkAdd(data.questions);
  await db.processes.bulkAdd(data.processes);
  await db.rackQuestions.bulkAdd(data.rackQuestions);
  await db.questionResponses.bulkAdd(data.questionResponses);
  await db.processResponses.bulkAdd(data.processResponses);
  await db.rooms.bulkAdd(data.rooms);
  await db.moreInfos.bulkAdd(data.moreInfos);
  await db.racks.bulkAdd(data.racks);
  await db.hardwares.bulkAdd(data.hardwares);
}
