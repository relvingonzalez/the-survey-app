//import { getSite } from "@/app/utils";

import { dummyQuestion } from "@/lib/data/questions";

export default async function QuestionPage() {
  const question = dummyQuestion;
  return <>{question.type}</>;
}
