import { Question, MultipleResponse } from "./question";
import { ServerQuestionResponse, ServerSiteProject } from "./server";
import Hardware from "../dexie/Hardware";
import MoreInfo from "../dexie/MoreInfo";
import Rack from "../dexie/Rack";
import ResponseGroup from "../dexie/ResponseGroup";
import Room from "../dexie/Room";
import Response from "../dexie/Response";
import Comment from "../dexie/Comment";

// delete, update, insert
export type ActionFlag = "d" | "u" | "i" | "o" | null;

export type DexieQuestion = Question & {
  localId?: number;
};

export type DexieResponse = Response;

export type DexieMultipleResponse = MultipleResponse & DexieResponse;

// export type DexieResponseGroupedByResponseType = Record<
//   Partial<ResponseType>,
//   ServerQuestionResponse[]
// >;

export type DexieResponseGroupedByResponseType = {
  [Key: string]: ServerQuestionResponse[];
};

export type DexieComment = Comment;

export type DexieRoom = Room;

export type DexieRack = Rack;

export type DexieHardware = Hardware;

export type DexieMoreInfo = MoreInfo;

export type DexieSiteProject = ServerSiteProject & {
  localId?: number;
};

export type DexieResponseGroup = ResponseGroup;

export type DexieStructure =
  | DexieResponse
  | DexieComment
  | DexieRoom
  | DexieRack
  | DexieMoreInfo
  | DexieHardware
  | DexieResponseGroup
  | Hardware;
