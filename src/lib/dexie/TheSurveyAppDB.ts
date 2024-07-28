import Dexie, { EntityTable, Table } from "dexie";

import { DexieSiteProject, DexieQuestion } from "../types/dexie";
import Hardware from "./Hardware";
import ResponseGroup from "./ResponseGroup";
import MoreInfo from "./MoreInfo";
import Response from "./Response";
import Comment from "./Comment";
import Rack from "./Rack";
import Room from "./Room";

export class TheSurveyAppDB extends Dexie {
  siteProjects!: Table<DexieSiteProject>;
  questions!: Table<DexieQuestion>;
  responses!: EntityTable<Response, "localId">;
  comments!: EntityTable<Comment, "localId">;
  rooms!: EntityTable<Room, "localId">;
  racks!: EntityTable<Rack, "localId">;
  moreInfos!: EntityTable<MoreInfo, "localId">;
  hardwares!: EntityTable<Hardware, "localId">;
  responseGroups!: EntityTable<ResponseGroup, "localId">;

  constructor() {
    super("theSurveyApp");
    this.version(56).stores({
      siteProjects: "++localId, projectId, &id, name, siteCode",
      questions:
        "++localId, &id, projectId, [projectId+order], [projectId+order+questionType], collectionId, questionType, [projectId+questionType], [projectId+collectionId]",
      responses:
        "++localId, id, questionResponseId, projectId, questionId, [projectId+questionId], responseGroupId, flag, [flag+responseGroupId], [questionId+responseGroupId]",
      responseGroups: "++localId, &id, projectId, collectionId, flag",
      comments:
        "++localId, &id, projectId, questionId, responseGroupId, [projectId+questionType], [projectId+questionId], flag, [flag+responseGroupId], [questionId+responseGroupId]",
      rooms: "++localId, &id, projectId, name, flag",
      racks: "++localId, &id, projectId, roomId, name, flag",
      moreInfos: "++localId, &id, projectId, roomId, flag",
      hardwares: "++localId, &id, projectId, rackId, flag",
    });

    this.responses.mapToClass(Response);
    this.comments.mapToClass(Comment);
    this.rooms.mapToClass(Room);
    this.racks.mapToClass(Rack);
    this.moreInfos.mapToClass(MoreInfo);
    this.hardwares.mapToClass(Hardware);
    this.responseGroups.mapToClass(ResponseGroup);
  }
}
