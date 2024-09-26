import { ServerQuestionResponse, ServerSiteProject } from "./server";
import {
  Comment,
  Hardware,
  MoreInfo,
  Question,
  Rack,
  Response,
  ResponseGroup,
  Room,
  SurveyFile,
} from "../../../internal";

// delete, update, insert
export type ActionFlag = "d" | "u" | "i" | "o" | null;

export type DexieResponseGroupedByResponseType = {
  [Key: string]: ServerQuestionResponse[];
};

export type DexieSiteProject = ServerSiteProject & {
  localId?: number;
};

export type DexieStructure =
  | Question
  | Response
  | Comment
  | Room
  | Rack
  | MoreInfo
  | Hardware
  | ResponseGroup
  | Hardware
  | SurveyFile;
