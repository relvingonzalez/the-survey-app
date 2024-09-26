import Comment from "@/components/Comment";
import { Button, Group, Modal, ModalProps } from "@mantine/core";
import { useForm } from "@mantine/form";
import Files from "@/components/files/Files.";
import { MoreInfo, SurveyFile } from "../../../../../internal";
import { useLiveQuery } from "dexie-react-hooks";

export type MoreInfoFormValues = {
  moreInfo: MoreInfo;
};

export type MoreInfoProps = ModalProps & {
  onSave: (moreInfo: MoreInfo, files: SurveyFile[]) => void;
};
export default function MoreInfoModal({
  onSave,
  onClose,
  ...modalProps
}: MoreInfoProps) {
  const form = useForm<MoreInfoFormValues>({
    mode: "uncontrolled",
    name: "more-info-form",
    validate: {
      moreInfo: {
        info: (value: string) => (value ? null : "Invalid comment"),
      },
    },
  });

  const files = useLiveQuery(
    () =>
      form.getValues().moreInfo &&
      SurveyFile.getByMoreInfo(form.getValues().moreInfo),
    [form],
    [],
  );

  // Check how to handle add or remove files before and after saving
  // What happens if removing or adding before saving.
  const handleFileDelete = (i: number) => {
    files[i].delete();
  };
  const handleSelectedFiles = (newFiles: File[]) => {
    const moreInfoId = form.getValues().moreInfo.id;
    newFiles.map((f) => SurveyFile.add({ moreInfoId, file: f }));
  };

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
