import { QuestionType } from "./question";
import { Coordinate, Hardware, MoreInfo } from "./rooms";

export type ServerQuestion = {
  id: number;
  type: QuestionType;
  subheading: string;
  order: number;
  question: string;
  options: string[];
};

export type QuestionResponse = {
  id: number;
  questionId: number;
  response: string;
  comment: string;
};

export type ProcessResponse = {
  id: number;
  processId: number;
  response: string;
  comment: string;
};

export type RackQuestionResponse = {
  id: number;
  rackQuestionId: number;
  response: string;
  comment: string;
};

export type ServerRoom = {
  id: number;
  projectId: number;
  name: string;
};

export type ServerRack = {
  id: number;
  roomId: number;
  name: string;
  x: Coordinate;
  y: Coordinate;
};

export type DownloadSiteData = {
  projectId: number;
  questions: ServerQuestion[];
  processes: ServerQuestion[];
  rackQuestions: ServerQuestion[];
  hardware: Hardware[];
  questionResponses: QuestionResponse[];
  processResponses: ProcessResponse[];
  rooms: ServerRoom[];
  moreInfo: MoreInfo[];
  racks: ServerRack[];
  rackQuestionResponses: RackQuestionResponse[];
};
