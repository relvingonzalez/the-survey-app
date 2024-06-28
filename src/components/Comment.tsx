import { Textarea, TextareaProps } from "@mantine/core";
import { ChangeEvent, useState } from "react";

type CommentProps = TextareaProps & {
  value: string;
  onChange: (value: string) => void;
};

export default function Comment({ value, onChange, ...props }: CommentProps) {
  const [commentValue, setCommentValue] = useState(value || "");
  const onCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentValue(event.currentTarget.value);
    onChange(event.currentTarget.value);
  };
  // useEffect(() => {
  //   if(!commentValue) {
  //     setCommentValue(value);
  //   }
  // }, [commentValue, value]);
  return (
    <Textarea
      {...props}
      label="Comments:"
      description=""
      placeholder="Comment"
      value={commentValue}
      onChange={onCommentChange}
    />
  );
}
