import { IndexableType, Table } from "dexie";
import { LocalSiteProject } from "./local_new";
import {
  Question,
  QuestionResponse,
  Comment,
  MultipleResponse,
} from "./question_new";
import { Hardware, MoreInfo, Rack, Room } from "./rooms";
import { ServerArray, ServerResponseGroup } from "./server_new";

type DefaultDexieUtilityType = {
  localId?: number;
  tempId?: number;
  flag?: ActionFlag;
};

// delete, update, insert
export type ActionFlag = "d" | "u" | "i";

export type DexieQuestion = Question & {
  localId?: number;
};

export type DexieResponse = DefaultDexieUtilityType & QuestionResponse;

export type DexieMultipleResponse = MultipleResponse & DexieResponse;

export type DexieResponseGroupedByResponseType = Record<
  ResponseType,
  DexieResponse[]
>;

export type DexieComment = Comment & DefaultDexieUtilityType;

export type DexieRoom = Room & DefaultDexieUtilityType;

export type DexieRack = DefaultDexieUtilityType & Rack;

export type DexieHardware = Hardware & DefaultDexieUtilityType;

export type DexieMoreInfo = DefaultDexieUtilityType & MoreInfo;

export type DexieSiteProject = LocalSiteProject & {
  localId?: number;
};

export type DexieResponseGroup = DefaultDexieUtilityType &
  ServerResponseGroup & {
    projectId?: number;
  };

export type DexieTransformToServer<
  T extends DexieStructure,
  K extends ServerArray,
> = (item: T) => K;

export type DexieStructure =
  | DexieSiteProject
  | DexieQuestion
  | DexieResponse
  | DexieComment
  | DexieRoom
  | DexieRack
  | DexieMoreInfo
  | DexieHardware
  | DexieResponseGroup;

export type DexieTable<K extends DexieStructure> = Table<K, IndexableType>;
