"use client";

import { TextInput, Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Room } from "@/lib/types/rooms";
import Comment from "../Comment";
import Files, { FileCallbacks } from "../files/Files.";
import ClickableDrawing, {
  ClickableDrawingProps,
} from "../Drawing/ClickableDrawing";
import { useLiveQuery } from "dexie-react-hooks";
import {
  saveMoreInfo,
  saveRack,
  clearRoomTools,
  getMoreInfosByRoomId,
  getRacksByRoomId,
} from "@/lib/dexie/helper";

export type RoomProps = FileCallbacks &
  Pick<ClickableDrawingProps, "onSaveDrawing"> & {
    room: Room;
    files: File[];
    plan?: File;
    onSave: (room: Room) => void;
    onDelete: (room: Room) => void;
  };

export default function RoomComponent({
  room,
  plan,
  onSave,
  onDelete,
  onSaveDrawing,
  ...filesProps
}: RoomProps) {
  // Get moreInfos and Racks from room
  const moreInfos = useLiveQuery(() => getMoreInfosByRoomId(room.id));
  const racks = useLiveQuery(() => getRacksByRoomId(room.id));
  const form = useForm({
    initialValues: {
      name: room?.name || "",
      comment: room?.comment || "",
    },
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: {
      name: (value) => (value ? null : "Room name is required"),
    },
  });

  if (!racks || !moreInfos) {
    return null;
  }

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) =>
          onSave({ ...room, name: values.name, comment: values.comment }),
        )}
      >
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
            room={room}
            racks={racks}
            moreInfos={moreInfos}
            onSaveRack={saveRack}
            onSaveMoreInfo={saveMoreInfo}
            onClear={() => clearRoomTools(room.id)}
          />
          <Group mb="10" justify="space-between">
            <Button mt="10" disabled={!form.isValid} type="submit">
              Save
            </Button>

            <Button
              variant="danger"
              mt="10"
              disabled={!form.isValid}
              onClick={() => onDelete(room)}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </form>
    </>
  );
}
