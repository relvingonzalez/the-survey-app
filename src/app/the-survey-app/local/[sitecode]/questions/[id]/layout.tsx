//import { getSite } from "@/app/utils";

import QuestionLayout from "@/components/Questions/QuestionLayout";
import { dummyQuestion } from "@/lib/data/questions";
import { dummySite } from "@/lib/data/sites";

export default async function QuestionPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const question = dummyQuestion;
  return (
    <QuestionLayout question={question} site={dummySite}>
      {children}
    </QuestionLayout>
  );
}
