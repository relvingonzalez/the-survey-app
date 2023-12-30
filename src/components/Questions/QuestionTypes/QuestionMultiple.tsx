import { MultiSelect } from "@mantine/core";
import { BaseQuestionProps } from "../Question";

export default function QuestionListSelect({ question }: BaseQuestionProps) {
  //question.answer[option]
  return (
    <>
      {question.type === "multiple" && (
        <MultiSelect
          name="list"
          label="Select"
          placeholder="--Select One or Many--"
          data={question.listOptions}
        />
      )}
    </>
  );
}
