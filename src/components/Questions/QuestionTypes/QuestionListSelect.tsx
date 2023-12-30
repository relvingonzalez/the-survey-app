import { Select } from "@mantine/core";
import { QuestionTypeProps } from "../QuestionType";

export default function QuestionListSelect({ question }: QuestionTypeProps) {
  //question.answer[option]
  return (
    <>
      {question.type === "list" && (
        <Select
          name="list"
          label="Select"
          placeholder="--Select One--"
          data={question.listOptions}
        />
      )}
    </>
  );
}
