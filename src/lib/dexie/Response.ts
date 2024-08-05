import { Entity } from "dexie";
import { Question, ResponseType, YesNo } from "../types/question";
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
import DexieObject from "./DexieObject";
import { dayOptionsById } from "@/components/Questions/QuestionTypes/QuestionDays";
import { saveResponses } from "../api/actions";
import {
  ActionFlag,
  db,
  DexieResponseGroupedByResponseType,
  getDeletedItemsByTable,
  getUpdatedItemsByTable,
  shouldIncludeId,
  type TheSurveyAppDB,
  uniqueId,
} from "../../../internal";

export class Response
  extends Entity<TheSurveyAppDB>
  implements DexieObject<Response>
{
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

  static create({ ...props }: Partial<Response>) {
    const response = Object.create(Response.prototype);
    Object.assign(response, props);
    response.id = response.id ?? uniqueId();
    response.flag = null;
    return response;
  }

  static async add({ ...props }: Partial<Response>) {
    const response = Response.create(props);
    const addedId = await db.responses.add(response);
    return db.responses.get(addedId);
  }

  static fromQuestion({ projectId, id, responseType }: Question) {
    return Response.add({ responseType, projectId, questionId: id });
  }

  static async bulkAdd(responses: Partial<Response>[]) {
    return responses.map(Response.add);
  }

  static async getCollectionResponses(
    questions?: Question[],
  ): Promise<Record<number, Response[]>> {
    // groupBy groupId or whatever
    let result = {};
    if (questions) {
      const ids = questions.map((q) => q.id);
      const responses = await db.responses
        .where("questionId")
        .anyOf(ids)
        .and((r) => r.flag !== "d")
        .sortBy("responseGroupId");

      result = responses.reduce(function (r, a) {
        if (a.responseGroupId !== undefined) {
          r[a.responseGroupId] = r[a.responseGroupId] || [];
          r[a.responseGroupId].push(a);
        }

        return r;
      }, Object.create(null));
    }

    return result;
  }

  static async getGroupedUpdatedAndSerialized() {
    const responses = await Response.getAllUpdated();
    const groupedResponses =
      responses.reduce<DexieResponseGroupedByResponseType>(function (r, a) {
        r[a.responseType] = r[a.responseType] || [];
        r[a.responseType].push(a.serialize());

        return r;
      }, {});

    return groupedResponses;
  }

  static async getAllUpdated() {
    return getUpdatedItemsByTable(db.responses);
  }

  static async getAllDeleted() {
    return getDeletedItemsByTable(db.responses);
  }

  static async getAllByProject(projectId: number) {
    return db.responses
      .where({ projectId })
      .and((r) => ["i", "u", null].includes(r.flag))
      .toArray();
  }

  static async sync() {
    const responsesGroupedByType =
      await Response.getGroupedUpdatedAndSerialized();
    await saveResponses(responsesGroupedByType);
  }

  static getDisplayValues(response: Response[]) {
    return response
      .map((r) => r.getDisplayValue())
      .filter((v) => v)
      .join(", ");
  }

  static async getFromQuestion({
    projectId,
    id: questionId,
    responseType,
  }: Question) {
    const response = await db.responses
      .where({ projectId, questionId })
      .and((r) => r.flag !== "d")
      .toArray();

    return response.length
      ? response
      : [
          Response.create({
            projectId,
            questionId,
            responseType,
          }),
        ];
  }

  setProps({ ...props }: Response) {
    Object.assign(this, props);
  }

  getDisplayValue() {
    switch (this.responseType) {
      case "checkbox":
        return this.checked ? this.label : "";
      case "datetime":
        return this.date?.toDateString();
      case "days":
        return dayOptionsById[this.dayId];
      case "email":
        return this.email;
      case "geo":
        return `${this.lat}, ${this.long}`;
      case "list":
        return this.text;
      case "multiple":
        return this.text;
      case "number":
        return this.number;
      case "person":
        return `${this.firstName} ${this.lastName}`;
      case "phone":
        return this.phone;
      case "text":
        return this.text;
      case "time":
        return `From: ${this.fromTime}, To: ${this.toTime}`;
      case "yes/no":
        return this.yesNo === null ? "Unknown" : this.yesNo ? "Yes" : "No";
    }
  }

  async delete() {
    return this.db.transaction("rw", this.db.responses, () => {
      if (this.flag === "i") {
        this.db.responses.where({ localId: this.localId }).delete();
      } else if (this.localId) {
        this.db.responses
          .where({ localId: this.localId })
          .modify({ flag: "d" });
      }
    });
  }

  async save() {
    this.flag = ["i", null].includes(this.flag) ? "i" : "u";
    return await this.db.responses.put(this);
  }

  async update({ ...props }: Partial<Response>) {
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
