import { Entity } from "dexie";
import { ActionFlag } from "../types/dexie";
import {
  Question,
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
import DexieObject from "./DexieObject";
import { TheSurveyAppDB } from "./TheSurveyAppDB";

export default class Response extends Entity<TheSurveyAppDB> implements DexieObject<Response> {
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
    
  static create({...props}: Partial<Response>): Response {
    const response = Object.create(Response.prototype);
    Object.assign(response, props);
    response.id = response.id ?? uniqueId();
    response.flag = null;
    return response;
  }
  
  static async add({...props}: Partial<Response>) {
    const response = Response.create(props);
    const addedId = await db.responses.add(response);
    return db.responses.get(addedId);
  };
  
  static fromQuestion({ projectId, id, responseType }: Question) {
    return this.add({ responseType, projectId, questionId: id });
  }

  static async bulkAdd(responses: Partial<Response>[]) {
    return responses.map(this.add);
  }

  setProps({ ...props }: Response) {
    Object.assign(this, props);
  }

  async delete() {
    return db.transaction("rw", db.responses, () => {
      if (this.flag === "i") {
        db.responses.where({ localId: this.localId }).delete();
      } else if(this.localId) {
        db.responses.where({ localId: this.localId }).modify({ flag: "d" });
      }
    });
  }

  async save() {
    this.flag = ["i", null].includes(this.flag) ? "i" : "u";
    return await db.responses.put(this);
  }

  async update({...props}: Partial<Response>) {
    return this.db.responses.update(this.localId, { ...props });
  }

  private baseServerProps() {
    return {
      ...shouldIncludeId(this.id, this.flag),
      questionResponseId: this.questionResponseId,
      flag: this.flag,
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
      dayId: this.dayId ?? null,
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
