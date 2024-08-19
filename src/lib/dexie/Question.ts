import { Entity } from "dexie";
import { ListOptions, QuestionType, ResponseType } from "../types/question";
import {
  ActionFlag,
  Response,
  TheSurveyAppDB,
  addItem,
  addItems,
  addItemsFromServer,
  createItem,
  db,
} from "../../../internal";

export class Question extends Entity<TheSurveyAppDB> {
  id!: number;
  localId!: number;
  flag!: ActionFlag;
  projectId!: number;
  rackId!: number;
  collectionId!: number;
  question!: string;
  order!: number;
  subheading!: string;
  responseType!: ResponseType;
  questionType!: QuestionType;
  options!: ListOptions;

  static create({ ...props }: Partial<Question>) {
    return createItem(Question.prototype, props);
  }

  static add({ ...props }: Partial<Question>) {
    return addItem(db.questions, Question.create(props));
  }

  static async bulkAdd(questions: Partial<Question>[]) {
    return addItems(Question.add, questions);
  }

  static async bulkAddFromServer(questions: Partial<Question>[]) {
    return addItemsFromServer(Question.add, questions);
  }

  static getNextUnanswered(questions?: Question[], responses?: Response[]) {
    return (
      questions?.find((q) => !responses?.find((r) => r.questionId === q.id)) ||
      (questions && questions[0])
    );
  }

  // Questions without collection type
  static async getMainQuestions(
    projectId?: number,
    questionType?: QuestionType,
  ) {
    return db.questions
      .where({ projectId, questionType })
      .filter((q) => q.collectionId === null || q.responseType === "collection")
      .sortBy("order");
  }

  async getPrev() {
    const questions = await this.db.questions
      .where({ projectId: this.projectId, questionType: this.questionType })
      .sortBy("order");
    const currentIndex = questions.findIndex((q) => q.id === this.id);
    return currentIndex > 0 ? questions[currentIndex - 1] : undefined;
  }

  async getNext() {
    const questions = await this.db.questions
      .where({ projectId: this.projectId, questionType: this.questionType })
      .sortBy("order");
    const currentIndex = questions.findIndex((q) => q.id === this.id);
    return currentIndex < questions.length
      ? questions[currentIndex + 1]
      : undefined;
  }

  async getCollectionQuestions() {
    return this.db.questions
      .where({ projectId: this.projectId, collectionId: this.collectionId })
      .filter((q) => q.responseType !== "collection")
      .sortBy("order");
  }
}
