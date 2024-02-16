import {
  Question,
  QuestionResponse,
  QuestionType,
  ResponseType,
  Comment,
} from "./question_new";
import { Coordinate } from "./rooms";
import { Site, SiteCode } from "./sites";

export type ServerSite = Omit<Site, "siteCode"> & {
  site_code: SiteCode;
};

export type ServerQuestion = Omit<
  Question,
  "collectionId" | "projectId" | "questionId" | "responseType" | "questionType"
> & {
  collection_id?: number;
  project_id?: number;
  response_id?: number;
  rack_id?: number;
  question_type: QuestionType;
  response_type: ResponseType;
};

export type ServerResponse = Omit<
  QuestionResponse,
  "projectId" | "questionId" | "responseId" | "responseType" | "collectionOrder"
> & {
  project_id?: number;
  question_id?: number;
  response_id?: number;
  response_type: ResponseType;
  collection_order: number;
};

export type ServerComment = Omit<Comment, "projectId" | "questionId"> & {
  project_id?: number;
  question_id?: number;
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
  rooms: ServerRoom[];
  moreInfo: ServerMoreInfo[];
  racks: ServerRack[];
  hardware: ServerHardware[];
};

export const createServerData = () => ({
  localSiteProject: undefined,
  questions: [],
  rooms: [],
  moreInfo: [],
  racks: [],
  hardware: [],
});
