import { ServerQuestionResponse } from "../types/server";

export default interface DexieObject<T> {
  serialize: () => ServerQuestionResponse;
  delete: () => Promise<void>;
  update: (item: Partial<T>) => Promise<number>;
  save: () => Promise<number>;
}
