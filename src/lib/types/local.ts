import {
  ServerHardware,
  ServerMoreInfo,
  ServerProcessResponse,
  ServerQuestion,
  ServerQuestionResponse,
  ServerRack,
  ServerRackQuestionResponse,
  ServerRoom,
  ServerSiteProject,
} from "./server";

export type LocalQuestion = Omit<ServerQuestion, "project_id"> & {
  projectId: number;
};

export type LocalQuestionResponse = Omit<
  ServerQuestionResponse,
  "question_id"
> & {
  questionId: number;
};

export type LocalProcess = LocalQuestion;
export type LocalRackQuestion = LocalQuestion;

export type LocalProcessResponse = Omit<ServerProcessResponse, "process_id"> & {
  processId: number;
};

export type LocalRackQuestionResponse = Omit<
  ServerRackQuestionResponse,
  "rack_question_id" | "rack_id"
> & {
  rackQuestionId: number;
  rackId: number;
};

export type LocalRoom = Omit<ServerRoom, "project_id"> & {
  projectId: number;
};

export type LocalRack = Omit<ServerRack, "room_id"> & {
  roomId: number;
};

export type LocalHardware = Omit<
  ServerHardware,
  "rack_id" | "from_slot" | "to_slot"
> & {
  rackId: number;
  fromSlot: string;
  toSlot: string;
};

export type LocalMoreInfo = Omit<ServerMoreInfo, "room_id"> & {
  roomId: number;
};

export type LocalSiteProject = Omit<ServerSiteProject, "project_id"> & {
  projectId: number;
};

export type LocalDownloadSiteData = {
  siteProject: LocalSiteProject;
  questions: LocalQuestion[];
  processes: LocalQuestion[];
  rackQuestions: LocalQuestion[];
  hardwares: LocalHardware[];
  questionResponses: LocalQuestionResponse[];
  processResponses: LocalProcessResponse[];
  rooms: LocalRoom[];
  moreInfos: LocalMoreInfo[];
  racks: LocalRack[];
  rackQuestionResponses: LocalRackQuestionResponse[];
};

export const createLocalData = () => ({
  siteProject: {
    projectId: 0,
    id: 0,
    siteCode: "",
    name: "",
    street: "",
    city: "",
    state: "",
    phone: "",
  },
  questions: [],
  processes: [],
  rackQuestions: [],
  questionResponses: [],
  processResponses: [],
  rooms: [],
  moreInfos: [],
  racks: [],
  rackQuestionResponses: [],
  hardwares: [],
});
