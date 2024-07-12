import {
  LocalHardware,
  LocalMoreInfo,
  LocalRack,
  LocalRoom,
  LocalSiteProject,
} from "./local_new";
import {
  Question,
  QuestionResponse,
  Comment,
  MultipleResponse,
} from "./question_new";
import { ServerResponseGroup } from "./server_new";

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

export type DexieRoom = LocalRoom & {
  localId?: number;
};

export type DexieRack = LocalRack & {
  localId?: number;
};

export type DexieHardware = LocalHardware & {
  localId?: number;
};

export type DexieMoreInfo = LocalMoreInfo & {
  localId?: number;
};

export type DexieSiteProject = LocalSiteProject & {
  localId?: number;
};

export type DexieResponseGroup = DefaultDexieUtilityType &
  ServerResponseGroup & {
    projectId?: number;
  };
