import { ActionFlag } from "../types/dexie";
import {
  Question,
  QuestionResponse,
  ResponseType,
  YesNo,
} from "../types/question";
import {
  ServerEmailResponse,
  ServerCheckboxResponse,
  ServerDateTimeResponse,
  ServerDaysResponse,
  ServerGeoResponse,
  ServerNumberResponse,
  ServerPersonResponse,
  ServerPhoneResponse,
  ServerTextResponse,
  ServerTimeResponse,
  ServerYesNoResponse,
} from "../types/server";
import { shouldIncludeId, uniqueId } from "../utils/functions";
import { db } from "./db";

export default class Response {
  localId!: number;
  id!: number;
  tempId!: number;
  flag!: ActionFlag;
  projectId!: number;
  questionId!: number;
  questionResponseId!: number;
  responseType!: ResponseType;
  responseGroupId!: number;
  text!: string | null;
  number!: number;
  label!: string;
  checked!: boolean;
  date!: Date | null;
  dayId!: number;
  salutationId!: number | undefined;
  firstName!: string;
  lastName!: string;
  email!: string;
  phone!: string;
  fromTime!: string;
  toTime!: string;
  yesNo!: YesNo;
  lat!: number | null;
  long!: number | null;

  constructor({ ...props }: Partial<Response>) {
    Object.assign(this, props);
    this.id = this.id || uniqueId();
    this.flag = this.flag || "i";
  }

  static fromQuestion({ projectId, id, responseType }: Question) {
    const response = new Response({ responseType, projectId, questionId: id });
    response.flag = "i";
    return response;
  }

  static deserialize({ ...serverProps }: QuestionResponse) {
    return new Response({ ...serverProps, flag: "o" });
  }

  setProps({ ...props }: Response) {
    Object.assign(this, props);
  }

  async delete() {
    return db.transaction("rw", db.responses, () => {
      if (this.flag === "i") {
        db.responses.where({ id: this.id }).delete();
      } else {
        db.responses.where({ id: this.id }).modify({ flag: "d" });
      }
    });
  }

  async save(questionResponseId: number) {
    this.questionResponseId = questionResponseId;
    this.flag = this.flag === "i" ? "i" : "u";
    return await db.responses.put(this);
  }

  private baseServerProps() {
    return {
      ...shouldIncludeId(this.id, this.flag),
      questionResponseId: this.questionResponseId,
    };
  }

  private serializeEmailResponse(): ServerEmailResponse {
    return {
      ...this.baseServerProps(),
      email: this.email,
    };
  }

  private serializeCheckboxResponse(): ServerCheckboxResponse {
    return {
      ...this.baseServerProps(),
      label: this.label,
      checked: this.checked,
    };
  }

  private serializeDatetimeResponse(): ServerDateTimeResponse {
    return {
      ...this.baseServerProps(),
      date: this.date,
    };
  }

  private serializeDaysResponse(): ServerDaysResponse {
    return {
      ...this.baseServerProps(),
      dayId: this.dayId,
    };
  }

  private serializeGeoResponse(): ServerGeoResponse {
    return {
      ...this.baseServerProps(),
      geog: `SRID=4326;POINT(${this.long} ${this.lat})`,
    };
  }

  private serializeNumberResponse(): ServerNumberResponse {
    return {
      ...this.baseServerProps(),
      number: this.number,
    };
  }

  private serializePersonResponse(): ServerPersonResponse {
    return {
      ...this.baseServerProps(),
      salutationId: this.salutationId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
    };
  }

  private serializePhoneResponse(): ServerPhoneResponse {
    return {
      ...this.baseServerProps(),
      phone: this.phone,
    };
  }

  private serializeTextResponse(): ServerTextResponse {
    return {
      ...this.baseServerProps(),
      text: this.text,
    };
  }

  private serializeTimeResponse(): ServerTimeResponse {
    return {
      ...this.baseServerProps(),
      fromTime: this.fromTime,
      toTime: this.toTime,
    };
  }

  private serializeYesNoResponse(): ServerYesNoResponse {
    return {
      ...this.baseServerProps(),
      yesNo: this.yesNo,
    };
  }

  // Prepare local responses for server insert/modify
  serialize() {
    switch (this.responseType) {
      case "checkbox":
        return this.serializeCheckboxResponse();
      case "datetime":
        return this.serializeDatetimeResponse();
      case "days":
        return this.serializeDaysResponse();
      case "email":
        return this.serializeEmailResponse();
      case "geo":
        return this.serializeGeoResponse();
      case "number":
        return this.serializeNumberResponse();
      case "person":
        return this.serializePersonResponse();
      case "phone":
        return this.serializePhoneResponse();
      case "time":
        return this.serializeTimeResponse();
      case "yes/no":
        return this.serializeYesNoResponse();
      default:
        return this.serializeTextResponse();
    }
  }
}
