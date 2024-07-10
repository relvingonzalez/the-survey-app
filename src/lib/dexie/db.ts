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
    this.version(41).stores({
      siteProjects: "++localId, projectId, &id, name, siteCode",
      questions:
        "++localId, &id, projectId, [projectId+order], [projectId+order+questionType], collectionId, questionType, [projectId+questionType], [projectId+collectionId]",
      responses:
        "++localId, id, questionResponseId, projectId, questionId, [projectId+questionId], responseGroupId, flag",
      comments:
        "++localId, &id, projectId, questionId, [projectId+questionType], [projectId+questionId], flag",
      rooms: "++localId, &id, projectId, name",
      racks: "++localId, &id, projectId, roomId, name",
      moreInfos: "++localId, &id, projectId, roomIdy",
      hardwares: "++localId, &id, projectId, rackId",
    });
  }
}

export const db = new TheSurveyAppDB();
