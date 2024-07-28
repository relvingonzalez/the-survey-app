import {
  Question,
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
  Coordinate,
  QuestionResponse,
} from "./question";
import { Site, SiteCode } from "./sites";

export type ServerSite = Omit<Site, "siteCode"> & {
  site_code: SiteCode;
};

export type ServerQuestion = Question;

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

export type ServerQuestionResponse =
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

export type ServerMoreInfo = {
  id?: number;
  roomId: number;
  x: Coordinate;
  y: Coordinate;
  info: string;
};

export type ServerHardware = {
  id?: number;
  rackId: number;
  name: string;
  fromSlot: string;
  toSlot: string;
  details: string;
};

export type ServerRack = {
  id?: number;
  roomId: number;
  x: Coordinate;
  y: Coordinate;
  comment: string;
  name: string;
};

export type ServerRoom = {
  id?: number;
  projectId: number;
  name: string;
  comment: string;
};

export type ServerRooms = ServerRoom[];

export type ServerSiteProject = Site & {
  projectId: number;
};

export type ServerDownloadSiteData = {
  siteProject: ServerSiteProject;
  questions: ServerQuestion[];
  rooms: ServerRoom[];
  moreInfos: ServerMoreInfo[];
  racks: ServerRack[];
  hardwares: ServerHardware[];
  responses: QuestionResponse[];
  comments: ServerComment[];
};

export type ServerResponseGroup = {
  id?: number;
  collectionId: number;
};

export const createServerData = () => ({
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
  rooms: [],
  moreInfos: [],
  racks: [],
  hardwares: [],
  responses: [],
  comments: [],
});

export type ServerTableIndex = Exclude<ResponseType, "collection">;

export type TableByQuestionType = Record<ServerTableIndex, string>;
export type ServerArray = ServerComment | ServerRoom | ServerQuestionResponse;
