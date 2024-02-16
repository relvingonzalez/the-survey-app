import {
  LocalHardware,
  LocalMoreInfo,
  LocalRack,
  LocalRoom,
  LocalSiteProject,
} from "./local_new";
import { Question, QuestionResponse, Comment } from "./question_new";

// delete, update, insert
export type ActionFlag = "d" | "u" | "i";

export type DexieQuestion = Question & {
  localId?: number;
};

export type DexieResponse = QuestionResponse & {
  localId?: number;
  tempId?: string;
  flag?: ActionFlag;
};

export type DexieComment = Comment & {
  localId?: number;
};

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
