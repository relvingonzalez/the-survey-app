"use client";

import { TextInput, Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { NewRoom, Room } from "@/lib/types/rooms";
import Comment from "../Comment";
import Files, { FileCallbacks } from "../files/Files.";
import ClickableDrawing, {
  ClickableDrawingProps,
} from "../Drawing/ClickableDrawing";

export type RoomProps = FileCallbacks &
  Pick<ClickableDrawingProps, "onSaveDrawing"> & {
    room: Room | NewRoom;
    files: File[];
    plan?: File;
    onSave: (room: Partial<Room>) => void;
    onDelete: (room: Room) => void;
  };

export function isExistingRoom(room: Room | NewRoom): room is Room {
  return (room as Room).id !== undefined;
}

export default function RoomComponent({
  room,
  plan,
  onSave,
  onDelete,
  onSaveDrawing,
  ...filesProps
}: RoomProps) {
  const form = useForm({
    initialValues: {
      name: room?.name || "",
      comment: room?.comment || "",
      racks: room?.racks || [],
      moreInfo: room?.moreInfo || [],
    },
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: {
      name: (value) => (value ? null : "Room name is required"),
    },
  });
  return (
    <>
      <form onSubmit={form.onSubmit((values) => onSave(values))}>
        <Stack justify="flex-start">
          <TextInput
            label="Room Name"
            placeholder="Room Name"
            withAsterisk
            {...form.getInputProps("name", { withError: true })}
          />
          <Comment {...form.getInputProps("comment")} />
          <Files {...filesProps} hideDrawingButton />
          <ClickableDrawing
            file={plan}
            onSaveDrawing={onSaveDrawing}
            isRoom
            racks={form.values.racks}
            moreInfo={form.values.moreInfo}
          />
          <Group mb="10" justify="space-between">
            <Button mt="10" disabled={!form.isValid} type="submit">
              Save
            </Button>
            {isExistingRoom(room) && (
              <Button
                variant="danger"
                mt="10"
                disabled={!form.isValid}
                onClick={() => onDelete(room)}
              >
                Delete
              </Button>
            )}
          </Group>
        </Stack>
      </form>
    </>
  );
}
