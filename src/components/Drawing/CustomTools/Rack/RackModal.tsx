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
import Files from "@/components/files/Files.";
import { useListState } from "@mantine/hooks";
import {
  IconDeviceFloppy,
  IconPencil,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { Hardware, Rack, SurveyFile } from "../../../../../internal";
import { useLiveQuery } from "dexie-react-hooks";

export type RackFormValues = {
  rack: Rack;
  hardwareList: Hardware[];
};

export type RackModalProps = ModalProps & {
  onSave: (rack: Rack, files: SurveyFile[]) => void;
  onSaveHardware: (hardwareList: Hardware[]) => void;
};
export default function RackModal({
  onSave,
  onSaveHardware,
  onClose,
  ...modalProps
}: RackModalProps) {
  const [edit, handlersEdit] = useListState<{ index: number; value: Hardware }>(
    [],
  );
  // const [files, handlers] = useListState<File>(existingFiles);
  // const handleFileDelete = (i: number) => {
  //   handlers.remove(i);
  // };
  // const handleSelectedFiles = (newFiles: File[]) => {
  //   handlers.append(...newFiles);
  // };

  const form = useForm<RackFormValues>({
    mode: "uncontrolled",
    name: "rack-form",
    validate: {
      rack: {
        name: (value) => (value ? null : "Invalid name"),
      },
      hardwareList: {
        name: (value) => (value ? null : "Invalid name"),
        fromSlot: (value) => (value ? null : "Invalid from"),
        toSlot: (value) => (value ? null : "Invalid to"),
        details: (value) => (value ? null : "Invalid details"),
      },
    },
  });

  const files = useLiveQuery(
    () => SurveyFile.getByRack(form.getValues().rack),
    [form],
    [],
  );

  // Check how to handle add or remove files before and after saving
  // What happens if removing or adding before saving.
  const handleFileDelete = (i: number) => {
    files[i].delete();
  };
  const handleSelectedFiles = (newFiles: File[]) => {
    const moreInfoId = form.getValues().rack.id;
    newFiles.map((f) => SurveyFile.add({ moreInfoId, file: f }));
  };

  const handleSubmit = (values: RackFormValues) => {
    onSave(values.rack, files);
    values.hardwareList && onSaveHardware(values.hardwareList);
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

  const handleInsertNewHardware = async () => {
    const { rack, hardwareList } = form.getValues();
    const hardware = Hardware.create({ rackId: rack.id });
    form.insertListItem("hardwareList", hardware);
    handleEditing(hardwareList?.length || 0, hardware);
  };

  const rows = form.getValues().hardwareList?.map((h, i) => {
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
                  key={form.key(`hardwareList.${i}.fromSlot`)}
                  {...form.getInputProps(`hardwareList.${i}.fromSlot`)}
                />
                -
                <TextInput
                  withAsterisk
                  label="To"
                  placeholder="To"
                  key={form.key(`hardwareList.${i}.toSlot`)}
                  {...form.getInputProps(`hardwareList.${i}.toSlot`)}
                />
              </Group>
            </TableTd>
            <TableTd>
              <Group>
                <TextInput
                  withAsterisk
                  label="Name"
                  placeholder="Name"
                  key={form.key(`hardwareList.${i}.name`)}
                  {...form.getInputProps(`hardwareList.${i}.name`)}
                />
                <TextInput
                  withAsterisk
                  label="Details"
                  placeholder="Details"
                  key={form.key(`hardwareList.${i}.details`)}
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
              {h.fromSlot} - {h.toSlot}
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
          {...form.getInputProps("rack.name")}
          key={form.key("rack.name")}
        />
        <Comment
          mb="md"
          withAsterisk
          {...form.getInputProps("rack.comment")}
          key={form.key("rack.comment")}
        />
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
