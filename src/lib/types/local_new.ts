import { Question, QuestionResponse, Comment } from "./question_new";
import {
  ServerHardware,
  ServerMoreInfo,
  ServerRack,
  ServerRoom,
  ServerSiteProject,
} from "./server";

export type LocalRoom = Omit<ServerRoom, "project_id"> & {
  projectId: number;
};

export type LocalRack = Omit<ServerRack, "room_id" | "project_id"> & {
  roomId: number;
  projectId: number;
};

export type LocalHardware = Omit<
  ServerHardware,
  "project_id" | "rack_id" | "from_slot" | "to_slot"
> & {
  id: number;
  projectId: number;
  rackId: number;
  fromSlot: string;
  toSlot: string;
};

export type LocalMoreInfo = Omit<ServerMoreInfo, "project_id" | "room_id"> & {
  projectId: number;
  roomId: number;
};

export type LocalSiteProject = Omit<ServerSiteProject, "project_id"> & {
  projectId: number;
};

export type LocalDownloadSiteData = {
  siteProject: LocalSiteProject;
  questions: Question[];
  responses: QuestionResponse[];
  comments: Comment[];
  rooms: LocalRoom[];
  moreInfos: LocalMoreInfo[];
  racks: LocalRack[];
  hardwares: LocalHardware[];
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
  responses: [],
  comments: [],
  rooms: [],
  moreInfos: [],
  racks: [],
  hardwares: [],
});
