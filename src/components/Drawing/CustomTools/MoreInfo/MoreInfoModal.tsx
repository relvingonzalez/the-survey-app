import Comment from "@/components/Comment";
import { Button, Group, Modal, ModalProps } from "@mantine/core";
import { useForm } from "@mantine/form";
import Files from "@/components/files/Files.";
import { useListState } from "@mantine/hooks";
import { MoreInfo } from "../../../../../internal";

export type MoreInfoFormValues = {
  moreInfo: MoreInfo;
};

export type MoreInfoProps = ModalProps & {
  existingFiles: File[];
  onSave: (moreInfo: MoreInfo, files: File[]) => void;
};
export default function MoreInfoModal({
  existingFiles = [],
  onSave,
  onClose,
  ...modalProps
}: MoreInfoProps) {
  const [files, handlers] = useListState<File>(existingFiles);
  const handleFileDelete = (i: number) => {
    handlers.remove(i);
  };
  const handleSelectedFiles = (newFiles: File[]) => {
    handlers.append(...newFiles);
  };

  const form = useForm<MoreInfoFormValues>({
    mode: "uncontrolled",
    name: "more-info-form",
    validate: {
      moreInfo: {
        info: (value: string) => (value ? null : "Invalid comment"),
      },
    },
  });

  const handleSubmit = (values: MoreInfoFormValues) => {
    onSave(values.moreInfo, files);
    onClose();
  };

  return (
    <Modal title="More Info" onClose={onClose} size="xl" {...modalProps}>
      <form onSubmit={form.onSubmit(handleSubmit)} className="w-100">
        <Comment
          className="mb-4"
          withAsterisk
          {...form.getInputProps("moreInfo.info")}
          key={form.key("moreInfo.info")}
        />
        <Files
          mt="10"
          files={files}
          hideDrawingButton
          onDeleteFile={handleFileDelete}
          onSelectFiles={handleSelectedFiles}
        />

        <Group justify="flex-start" mt="md">
          <Button disabled={!form.isValid} type="submit">
            Save
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
