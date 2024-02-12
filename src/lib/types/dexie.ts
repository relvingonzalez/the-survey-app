import {
  LocalHardware,
  LocalMoreInfo,
  LocalRack,
  LocalRoom,
  LocalSiteProject,
} from "./local_new";
import { Question, QuestionResponse, Comment } from "./question_new";

export type DexieQuestion = Question & {
  localId?: number;
};

export type DexieResponse = QuestionResponse & {
  localId?: number;
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
