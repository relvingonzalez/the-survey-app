//import { getSite } from "@/app/utils";

import QuestionLayout from "@/components/Questions/QuestionLayout";
import { dummyQuestion, dummyQuestions } from "@/lib/data/questions";

export default async function QuestionPage({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  let currentIndex = 0;
  const question =
    dummyQuestions.find((q, i) => {
      if (q.id === id) {
        currentIndex = i;
        return true;
      }
    }) || dummyQuestion;
  const nextId = dummyQuestions[currentIndex + 1]?.id;
  const prevId = dummyQuestions[currentIndex - 1]?.id;
  console.log(question);

  return (
    <QuestionLayout
      isQuestion
      question={question}
      prevId={prevId}
      nextId={nextId}
    >
      {children}
    </QuestionLayout>
  );
}
