import { QuestionType } from "./question";
import { Coordinate } from "./rooms";
import { Site, SiteCode } from "./sites";

export type ServerSite = Omit<Site, "siteCode"> & {
  site_code: SiteCode;
};

export type ServerResponse = {
  response: string;
  comment: string;
};

export type ServerQuestion = {
  id: number;
  project_id: number;
  type: QuestionType;
  subheading: string;
  order: number;
  question: string;
  options: string[];
};

export type ServerQuestionResponse = ServerResponse & {
  id: number;
  project_id: number;
  question_id: number;
};

export type ServerProcessResponse = ServerResponse & {
  id: number;
  project_id: number;
  process_id: number;
};

export type ServerRackQuestionResponse = ServerResponse & {
  id: number;
  project_id: number;
  rack_id: number;
  rack_question_id: number;
};

export type ServerRoom = {
  id: number;
  project_id: number;
  name: string;
};

export type ServerMoreInfo = {
  id: number;
  project_id: number;
  room_id: number;
  info: string;
  x: Coordinate;
  y: Coordinate;
};

export type ServerRack = {
  id: number;
  project_id: number;
  room_id: number;
  name: string;
  x: Coordinate;
  y: Coordinate;
};

export type ServerHardware = {
  id: number;
  project_id: number;
  rack_id: number;
  name: string;
  from_slot: string;
  to_slot: string;
  details: string;
};

export type ServerSiteProject = Site & {
  project_id: number;
};

export type DownloadSiteData = {
  siteProject: ServerSiteProject;
  questions: ServerQuestion[];
  processes: ServerQuestion[];
  rackQuestions: ServerQuestion[];
  hardware: ServerHardware[];
  questionResponses: ServerQuestionResponse[];
  processResponses: ServerProcessResponse[];
  rooms: ServerRoom[];
  moreInfo: ServerMoreInfo[];
  racks: ServerRack[];
  rackQuestionResponses: ServerRackQuestionResponse[];
};

export const createServerData = () => ({
  localSiteProject: undefined,
  questions: [],
  processes: [],
  rackQuestions: [],
  questionResponses: [],
  processResponses: [],
  rooms: [],
  moreInfo: [],
  racks: [],
  rackQuestionResponses: [],
  hardware: [],
});
