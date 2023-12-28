import { Process, Question } from "@/lib/types/question";
import { TextInput } from "@mantine/core";

type QuestionTextProps = {
  question: Question | Process;
};

export default function QuestionText({ question }: QuestionTextProps) {
  return <TextInput placeholder="Text" value={question.answer.value} />;
}
