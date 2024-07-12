import {
  Question,
  QuestionType,
  ResponseType,
  Comment,
  CheckboxValue,
  DateTimeValue,
  DaysValue,
  EmailValue,
  ListValue,
  MultipleValue,
  NumberValue,
  PersonValue,
  PhoneValue,
  TextValue,
  TimeValue,
  YesNoValue,
} from "./question_new";
import { Coordinate, Room } from "./rooms";
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

export type ServerResponse = {
  id?: number;
  questionResponseId?: number;
};

export type ServerGeoResponse = ServerResponse & {
  geog: string;
};

export type ServerTextResponse = ServerResponse & TextValue;

export type ServerEmailResponse = ServerResponse & EmailValue;

export type ServerCheckboxResponse = ServerResponse & CheckboxValue;

export type ServerDateTimeResponse = ServerResponse & DateTimeValue;

export type ServerDaysResponse = ServerResponse & DaysValue;

export type ServerMultipleResponse = ServerResponse & MultipleValue;

export type ServerPersonResponse = ServerResponse & PersonValue;

export type ServerTimeResponse = ServerResponse & TimeValue;

export type ServerYesNoResponse = ServerResponse & YesNoValue;

export type ServerListResponse = ServerResponse & ListValue;

export type ServerNumberResponse = ServerResponse & NumberValue;

export type ServerPhoneResponse = ServerResponse & PhoneValue;

export type ServerResponseTypes =
  | ServerGeoResponse
  | ServerTextResponse
  | ServerEmailResponse
  | ServerCheckboxResponse
  | ServerDateTimeResponse
  | ServerDaysResponse
  | ServerMultipleResponse
  | ServerPersonResponse
  | ServerTimeResponse
  | ServerYesNoResponse
  | ServerListResponse
  | ServerNumberResponse
  | ServerPhoneResponse;

export type ServerComment = Omit<Comment, "projectId">;

export type ServerRoom = Omit<Room, 'id'> & {
  id?: number;
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

export type ServerResponseGroup = {
  id: number;
  collectionId: number;
};

export const createServerData = () => ({
  localSiteProject: undefined,
  questions: [],
  rooms: [],
  moreInfo: [],
  racks: [],
  hardware: [],
});
