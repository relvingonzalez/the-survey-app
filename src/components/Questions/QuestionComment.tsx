import { Textarea, TextareaProps } from "@mantine/core";

type QuestionCommentProps = TextareaProps & {
  value: string;
  onChange: (value: string) => void;
};

export default function QuestionComment({
  value,
  onChange,
  ...props
}: QuestionCommentProps) {
  return (
    <Textarea
      {...props}
      label="Comments:"
      description=""
      placeholder="Comment"
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  );
}
