import Comment from "@/components/Comment";
import { Button, Group, Modal, ModalProps } from "@mantine/core";
import { useForm } from "@mantine/form";
import { MoreInfo } from "@/lib/types/rooms";
import Files from "@/components/files/Files.";
import { useListState } from "@mantine/hooks";

export type MoreInfoProps = ModalProps & {
  moreInfo: MoreInfo;
  existingFiles: File[];
  onSave: (info: string, files: File[]) => void;
};
export default function MoreInfoModal({
  moreInfo,
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

  const form = useForm({
    initialValues: {
      info: moreInfo.info || "",
      x: moreInfo.x,
      y: moreInfo.y,
    },

    validate: {
      info: (value) => (value ? null : "Invalid comment"),
    },
  });

  const handleSubmit = (values: MoreInfo) => {
    onSave(values.info, files);
    onClose();
  };

  return (
    <Modal title="More Info" onClose={onClose} {...modalProps}>
      <form onSubmit={form.onSubmit(handleSubmit)} className="w-100">
        <Comment
          className="mb-4"
          withAsterisk
          {...form.getInputProps("info")}
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
