//import { getSite } from "@/app/utils";

import Question from "@/components/Questions/Question";
import { dummyQuestion, dummyQuestions } from "@/lib/data/questions";

export default async function QuestionPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const question = dummyQuestions.find((q) => q.id === id) || dummyQuestion;
  return <Question question={question} />;
}
