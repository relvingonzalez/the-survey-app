import { Textarea, TextareaProps } from "@mantine/core";

type CommentProps = TextareaProps & {
  value: string;
  onChange: (value: string) => void;
};

export default function Comment({ value, onChange, ...props }: CommentProps) {
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
