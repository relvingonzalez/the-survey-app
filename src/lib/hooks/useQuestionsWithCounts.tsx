import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../dexie/db";
import { DexieSiteProject } from "../../../internal";

export const useQuestionsWithCounts = (site?: DexieSiteProject) => {
  const allQuestions = useLiveQuery(() => {
    if (site) {
      return db.questions.where({ projectId: site.projectId }).sortBy("order");
    }
    return [];
  }, [site]);
  const allResponses = useLiveQuery(() => {
    if (site) {
      return db.responses.where({ projectId: site?.projectId }).toArray();
    }
    return [];
  }, [site]);
  const roomsCount = useLiveQuery(() => {
    if (site) {
      return db.rooms.where({ projectId: site.projectId }).count();
    }
    return 0;
  }, [site]);
  const questions = allQuestions?.filter((q) => q.questionType === "question");
  const processes = allQuestions?.filter((q) => q.questionType === "process");
  const questionsCount = questions?.length;
  const processesCount = processes?.length;
  const questionResponsesCount = questions?.filter(
    (q) => allResponses?.find((r) => q.id === r.questionId),
  ).length;
  const processResponsesCount = processes?.filter(
    (q) => allResponses?.find((r) => q.id === r.questionId),
  ).length;

  return {
    questions,
    processes,
    allResponses,
    roomsCount,
    questionsCount,
    processesCount,
    questionResponsesCount,
    processResponsesCount,
  };
};
