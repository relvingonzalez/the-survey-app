import {
  LocalHardware,
  LocalMoreInfo,
  LocalProcessResponse,
  LocalQuestion,
  LocalQuestionResponse,
  LocalRack,
  LocalRackQuestionResponse,
  LocalRoom,
  LocalSiteProject,
} from "./local";

export type DexieQuestion = LocalQuestion & {
  localId?: number;
};

export type DexieQuestionResponse = LocalQuestionResponse & {
  localId?: number;
};

export type DexieProcess = LocalQuestion & {
  localId?: number;
};

export type DexieProcessResponse = LocalProcessResponse & {
  localId?: number;
};

export type DexieRackQuestion = LocalQuestion & {
  localId?: number;
};

export type DexieRackQuestionResponse = LocalRackQuestionResponse & {
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
