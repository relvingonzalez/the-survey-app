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
import { useLiveQuery } from "dexie-react-hooks";
import { getHardwareListByRackId } from "@/lib/dexie/helper";
import { DexieHardware, DexieRack } from "@/lib/types/dexie";
import { createHardware } from "@/lib/utils/functions";
import { useEffect } from "react";

type RackFormValues = {
  rack: DexieRack;
  hardwareList?: DexieHardware[];
};

export type RackModalProps = ModalProps & {
  rack: DexieRack;
  existingFiles: File[];
  onSave: (rack: Rack, files: File[]) => void;
  onSaveHardware: (hardwareList: DexieHardware[]) => void;
};
export default function RackModal({
  rack,
  existingFiles = [],
  onSave,
  onSaveHardware,
  onClose,
  ...modalProps
}: RackModalProps) {
  const hardwareList = useLiveQuery(() => getHardwareListByRackId(rack.id));
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
      rack,
      hardwareList: hardwareList,
    },

    validate: {
      rack: {
        name: (value) => (value ? null : "Invalid comment"),
      },
      hardwareList: {
        name: (value) => (value ? null : "Invalid name"),
        fromSlot: (value) => (value ? null : "Invalid from"),
        toSlot: (value) => (value ? null : "Invalid to"),
        details: (value) => (value ? null : "Invalid details"),
      },
    },
  });

  useEffect(() => {
    if (hardwareList && !form.values.hardwareList) {
      form.setFieldValue("hardwareList", hardwareList);
    }
  }, [form, hardwareList]);

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

  const handleInsertNewHardware = () => {
    const hardware = createHardware(rack.id);
    form.insertListItem("hardwareList", hardware);
    handleEditing(form.values.hardwareList?.length || 0, hardware);
  };

  if (!rack || !hardwareList) {
    return null;
  }

  const rows = form.values.hardwareList?.map((h, i) => {
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
                  {...form.getInputProps(`hardwareList.${i}.fromSlot`)}
                />
                -
                <TextInput
                  withAsterisk
                  label="To"
                  placeholder="To"
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
        />
        <Comment mb="md" withAsterisk {...form.getInputProps("rack.comment")} />
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
