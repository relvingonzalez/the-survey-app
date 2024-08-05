import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../dexie/db";
import { QuestionType } from "../types/question";

export const useQuestionNavigation = (
  projectId: number,
  order: number,
  questionType: QuestionType,
) => {
  const current = useLiveQuery(
    () => db.questions.get({ projectId, order, questionType }),
    [projectId, questionType, order],
  );
  const prev = useLiveQuery(() => current?.getPrev(), [current]);

  const next = useLiveQuery(() => current?.getNext(), [current]);

  return {
    current,
    prev,
    next,
  };
};
