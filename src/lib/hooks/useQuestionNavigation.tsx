import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../dexie/db";
import { QuestionType } from "../types/question";
import { getPrevQuestion, getNextQuestion } from "../dexie/helper";

export const useQuestionNavigation = (
  projectId: number,
  order: number,
  questionType: QuestionType,
) => {
  const current = useLiveQuery(
    () => db.questions.get({ projectId, order, questionType }),
    [projectId, questionType, order],
  );
  const prev = useLiveQuery(
    () => getPrevQuestion(projectId, questionType, current),
    [projectId, current, questionType],
  );

  const next = useLiveQuery(
    () => getNextQuestion(projectId, questionType, current),
    [projectId, current, questionType],
  );

  return {
    current,
    prev,
    next,
  };
};
