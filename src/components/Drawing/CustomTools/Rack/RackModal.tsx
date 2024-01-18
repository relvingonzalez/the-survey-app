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
  Text,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Hardware, Rack } from "@/lib/types/rooms";
import Files from "@/components/files/Files.";
import { useListState } from "@mantine/hooks";
import {
  IconDeviceFloppy,
  IconPencil,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { createHardware } from "@/lib/data/rooms";

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
  const [edit, handlersEdit] = useListState<{ index: number; value: Hardware }>(
    [],
  );
  const handleFileDelete = (i: number) => {
    handlers.remove(i);
  };
  const handleSelectedFiles = (newFiles: File[]) => {
    handlers.append(...newFiles);
  };

  const form = useForm({
    initialValues: {
      rackName: rack.rackName || "",
      hardwareList: rack.hardwareList || [],
      rackComment: rack.rackComment || "",
      x: rack.x,
      y: rack.y,
    },

    validate: {
      rackName: (value) => (value ? null : "Invalid comment"),
      hardwareList: {
        name: (value) => (value ? null : "Invalid name"),
        from: (value) => (value ? null : "Invalid from"),
        to: (value) => (value ? null : "Invalid to"),
        details: (value) => (value ? null : "Invalid details"),
      },
    },
  });

  const handleSubmit = (values: Rack) => {
    onSave(values, files);
    form.reset();
    onClose();
  };

  const handleCancelEdit = (i: number) => {
    form.setFieldValue(
      `hardwareList.${i}`,
      edit.find((v) => v.index === i)?.value,
    );
    handlersEdit.filter((v) => v.index !== i);
  };

  const handleSaveEdit = (i: number) => {
    if (!form.validateField(`hardwareList.${i}`).hasError) {
      handlersEdit.filter((v) => v.index !== i);
    }
  };

  const handleEditing = (i: number, oldValue: Hardware) => {
    handlersEdit.append({ index: i, value: oldValue });
  };

  const handleInsertNewHardware = () => {
    const hardware = createHardware();
    form.insertListItem("hardwareList", hardware);
    handleEditing(form.values.hardwareList.length, hardware);
  };

  const rows = form.values.hardwareList.map((h, i) => {
    const editMode = edit.find((v) => v.index === i);
    return (
      <TableTr key={i}>
        {editMode && (
          <>
            <TableTd>
              <Group>
                <TextInput
                  withAsterisk
                  label="From"
                  placeholder="From"
                  {...form.getInputProps(`hardwareList.${i}.from`)}
                />
                -
                <TextInput
                  withAsterisk
                  label="To"
                  placeholder="To"
                  {...form.getInputProps(`hardwareList.${i}.to`)}
                />
              </Group>
            </TableTd>
            <TableTd>
              <Group>
                <TextInput
                  withAsterisk
                  label="Name"
                  placeholder="Name"
                  {...form.getInputProps(`hardwareList.${i}.name`)}
                />
                <TextInput
                  withAsterisk
                  label="Details"
                  placeholder="Details"
                  {...form.getInputProps(`hardwareList.${i}.details`)}
                />
              </Group>
            </TableTd>
            <TableTd>
              <ActionIcon
                variant="subtle"
                size="xl"
                onClick={() => handleCancelEdit(i)}
              >
                <IconX style={{ width: rem(20) }} stroke={1.5} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                size="xl"
                onClick={() => handleSaveEdit(i)}
              >
                <IconDeviceFloppy style={{ width: rem(20) }} stroke={1.5} />
              </ActionIcon>
            </TableTd>
          </>
        )}

        {!editMode && (
          <>
            <TableTd>
              {h.from} - {h.to}
            </TableTd>
            <TableTd>
              <Text>{h.name}</Text>
              <Text>{h.details}</Text>
            </TableTd>
            <TableTd>
              <ActionIcon
                variant="subtle"
                size="xl"
                onClick={() => handleEditing(i, h)}
              >
                <IconPencil style={{ width: rem(20) }} stroke={1.5} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                size="xl"
                onClick={() => form.removeListItem("hardwareList", i)}
              >
                <IconTrash style={{ width: rem(20) }} stroke={1.5} />
              </ActionIcon>
            </TableTd>
          </>
        )}
      </TableTr>
    );
  });

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
        <Table
          mt="20"
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
        >
          <TableThead>
            <TableTr>
              <TableTh w="40%">Slots</TableTh>
              <TableTh w="40%">Description</TableTh>
              <TableTh w="20%">Action</TableTh>
            </TableTr>
          </TableThead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        <Button mt="10" variant="default" onClick={handleInsertNewHardware}>
          Add New Hardware
        </Button>
        <Group justify="flex-start" mt="md">
          <Button disabled={!form.isValid} type="submit">
            Save
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
