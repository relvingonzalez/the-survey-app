import Dexie, { Table, EntityTable } from "dexie";
import {
  ResponseGroup,
  Question,
  Response,
  Comment,
  Hardware,
  MoreInfo,
  Rack,
  Room,
  DexieSiteProject,
  SurveyFile,
} from "../../../internal";

export class TheSurveyAppDB extends Dexie {
  comments!: EntityTable<Comment, "localId">;
  hardwares!: EntityTable<Hardware, "localId">;
  moreInfos!: EntityTable<MoreInfo, "localId">;
  questions!: EntityTable<Question, "localId">;
  racks!: EntityTable<Rack, "localId">;
  responses!: EntityTable<Response, "localId">;
  responseGroups!: EntityTable<ResponseGroup, "localId">;
  rooms!: EntityTable<Room, "localId">;
  siteProjects!: Table<DexieSiteProject>;
  surveyFiles!: EntityTable<SurveyFile, "localId">;

  constructor() {
    super("theSurveyApp");
    this.version(62).stores({
      comments:
        "++localId, &id, projectId, questionId, responseGroupId, [projectId+questionType], [projectId+questionId], flag, [flag+responseGroupId], [questionId+responseGroupId]",
      hardwares: "++localId, &id, projectId, rackId, flag",
      moreInfos: "++localId, &id, projectId, roomId, flag",
      questions:
        "++localId, &id, projectId, [projectId+order], [projectId+order+questionType], collectionId, questionType, [projectId+questionType], [projectId+collectionId]",
      racks: "++localId, &id, projectId, roomId, name, flag",
      responses:
        "++localId, id, questionResponseId, projectId, questionId, [projectId+questionId], responseGroupId, flag, [flag+responseGroupId], [questionId+responseGroupId]",
      responseGroups: "++localId, &id, projectId, collectionId, flag",
      rooms: "++localId, &id, projectId, name, flag",
      siteProjects: "++localId, projectId, &id, name, siteCode",
      surveyFiles:
        "++localId, projectId, &id, questionResponseId, roomId, rackId, moreInfoId, signatureTypeId, isPlan, flag",
    });

    this.comments.mapToClass(Comment);
    this.hardwares.mapToClass(Hardware);
    this.moreInfos.mapToClass(MoreInfo);
    this.questions.mapToClass(Question);
    this.racks.mapToClass(Rack);
    this.responses.mapToClass(Response);
    this.responseGroups.mapToClass(ResponseGroup);
    this.rooms.mapToClass(Room);
    this.surveyFiles.mapToClass(SurveyFile);
  }
}
