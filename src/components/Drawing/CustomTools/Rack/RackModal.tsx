import Comment from "@/components/Comment";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  ModalProps,
  Table,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  TextInput,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Hardware, Rack } from "@/lib/types/rooms";
import Files from "@/components/files/Files.";
import { useListState } from "@mantine/hooks";
import { IconPencil, IconTrash } from "@tabler/icons-react";

export type RackModalProps = ModalProps & {
  rack: Rack;
  existingFiles: File[];
  onSave: (rack: Rack, files: File[]) => void;
};
export default function RackModal({
  rack,
  existingFiles = [],
  onSave,
  onClose,
  ...modalProps
}: RackModalProps) {
  const [files, handlers] = useListState<File>(existingFiles);
  const [rackList, handlersRackList] = useListState<Hardware>(rack.rackList);
  const handleFileDelete = (i: number) => {
    handlers.remove(i);
  };
  const handleSelectedFiles = (newFiles: File[]) => {
    handlers.append(...newFiles);
  };

  const form = useForm({
    initialValues: {
      rackName: rack.rackName || "",
      rackList: rack.rackList || [],
      rackComment: rack.rackComment || "",
      x: rack.x,
      y: rack.y,
    },

    validate: {
      rackName: (value) => (value ? null : "Invalid comment"),
    },
  });

  const handleSubmit = (values: Rack) => {
    onSave(values, files);
    onClose();
  };

  const rows = rackList.map((h, i) => (
    <TableTr key={i}>
      <TableTd>
        {h.from} - {h.to}
      </TableTd>
      <TableTd>
        {h.name}
        {h.details}
      </TableTd>
      <TableTd>
        <ActionIcon size="xl" onClick={() => handlersRackList.remove(i)}>
          <IconTrash style={{ width: rem(20) }} stroke={1.5} />
        </ActionIcon>
        <ActionIcon size="xl">
          <IconPencil style={{ width: rem(20) }} stroke={1.5} />
        </ActionIcon>
      </TableTd>
    </TableTr>
  ));

  return (
    <Modal title="Rack" onClose={onClose} size="xl" {...modalProps}>
      <form onSubmit={form.onSubmit(handleSubmit)} className="w-100">
        <TextInput
          label="ID / Name of rack"
          mb="md"
          placeholder="ID / Name of Rack"
          withAsterisk
          {...form.getInputProps("rackName")}
        />
        <Comment mb="md" withAsterisk {...form.getInputProps("rackComment")} />
        <Files
          mt="10"
          files={files}
          hideDrawingButton
          onDeleteFile={handleFileDelete}
          onSelectFiles={handleSelectedFiles}
        />
        {rackList.length > 0 && (
          <Table>
            <TableThead>
              <TableTr>
                <TableTh>Slots</TableTh>
                <TableTh>Description</TableTh>
                <TableTh>Action</TableTh>
              </TableTr>
            </TableThead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        )}

        <Group justify="flex-start" mt="md">
          <Button disabled={!form.isValid} type="submit">
            Save
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
