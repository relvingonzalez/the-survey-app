import Dexie, { Table } from "dexie";
import {
  DexieSiteProject,
  DexieQuestion,
  DexieRoom,
  DexieRack,
  DexieMoreInfo,
  DexieHardware,
  DexieResponse,
  DexieComment,
} from "../types/dexie";

export class TheSurveyAppDB extends Dexie {
  siteProjects!: Table<DexieSiteProject>;
  questions!: Table<DexieQuestion>;
  responses!: Table<DexieResponse>;
  comments!: Table<DexieComment>;
  rooms!: Table<DexieRoom>;
  racks!: Table<DexieRack>;
  moreInfos!: Table<DexieMoreInfo>;
  hardwares!: Table<DexieHardware>;

  constructor() {
    super("theSurveyApp");
    this.version(31).stores({
      siteProjects: "++localId, projectId, &id, name, siteCode",
      questions:
        "++localId, &id, projectId, [projectId+order], [projectId+order+questionType], collectionId, questionType, [projectId+questionType], [projectId+collectionId]",
      responses:
        "++localId, responseId, projectId, questionId, [projectId+questionId]",
      comments:
        "++localId, &id, projectId, [projectId+questionType], [projectId+questionId]",
      rooms: "++localId, &id, projectId, name",
      racks: "++localId, &id, projectId, roomId, name",
      moreInfos: "++localId, &id, projectId, roomIdy",
      hardwares: "++localId, &id, projectId, rackId",
    });
  }
}

export const db = new TheSurveyAppDB();
