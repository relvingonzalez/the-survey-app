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
  DexieResponseGroup,
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
  responseGroups!: Table<DexieResponseGroup>;

  constructor() {
    super("theSurveyApp");
    this.version(50).stores({
      siteProjects: "++localId, projectId, &id, name, siteCode",
      questions:
        "++localId, &id, projectId, [projectId+order], [projectId+order+questionType], collectionId, questionType, [projectId+questionType], [projectId+collectionId]",
      responses:
        "++localId, id, questionResponseId, projectId, questionId, [projectId+questionId], responseGroupId, flag, [flag+responseGroupId], [questionId+responseGroupId]",
      responseGroups: "++localId, &id, projectId, collectionId, flag",
      comments:
        "++localId, &id, projectId, questionId, responseGroupId, [projectId+questionType], [projectId+questionId], flag, [flag+responseGroupId], [questionId+responseGroupId]",
      rooms: "++localId, &id, projectId, name",
      racks: "++localId, &id, projectId, roomId, name",
      moreInfos: "++localId, &id, projectId, roomId",
      hardwares: "++localId, &id, projectId, rackId",
    });
  }
}

export const db = new TheSurveyAppDB();
