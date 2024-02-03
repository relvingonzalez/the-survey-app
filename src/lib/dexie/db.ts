import Dexie, { Table } from "dexie";
import {
  DexieSiteProject,
  DexieQuestion,
  DexieProcess,
  DexieRackQuestion,
  DexieRoom,
  DexieRack,
  DexieMoreInfo,
  DexieHardware,
  DexieQuestionResponse,
  DexieProcessResponse,
  DexieRackQuestionResponse,
} from "../types/dexie";

export class TheSurveyAppDB extends Dexie {
  siteProjects!: Table<DexieSiteProject>;
  questions!: Table<DexieQuestion>;
  processes!: Table<DexieProcess>;
  rackQuestions!: Table<DexieRackQuestion>;
  rooms!: Table<DexieRoom>;
  racks!: Table<DexieRack>;
  moreInfos!: Table<DexieMoreInfo>;
  hardwares!: Table<DexieHardware>;
  questionResponses!: Table<DexieQuestionResponse>;
  processResponses!: Table<DexieProcessResponse>;
  rackQuestionResponses!: Table<DexieRackQuestionResponse>;

  constructor() {
    super("theSurveyApp");
    this.version(2).stores({
      siteProjects:
        "++localId, projectId, &id, name, siteCode, street, city, state, phone",
      questions:
        "++localId, &id, projectId, type, subheading, order, question, options",
      processes:
        "++localId, &id, projectId, type, subheading, order, question, options",
      rackQuestions:
        "++localId, &id, &projectId, type, subheading, order, question, options",
      rooms: "++localId, &id, projectId, name",
      racks: "++localId, &id, projectId, roomId, name, x, y",
      moreInfos: "++localId, &id, projectId, roomId, info, x, y",
      hardwares:
        "++localId, &id, projectId, rackId, name, fromSlot, toSlot, details",
      questionResponses:
        "++localId, &id, projectId, questionId, response, comment",
      processResponses:
        "++localId, &id, projectId, questionId, response, comment",
      rackQuestionResponses:
        "++localId, &id, projectId, rackId, rackQuestionId, response, comment",
    });
  }
}

export const db = new TheSurveyAppDB();
