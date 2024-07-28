"use client";

import { TextInput, Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import Comment from "../Comment";
import Files, { FileCallbacks } from "../files/Files.";
import ClickableDrawing, {
  ClickableDrawingProps,
} from "../Drawing/ClickableDrawing";
import { useLiveQuery } from "dexie-react-hooks";
import { getMoreInfosByRoomId, getRacksByRoomId } from "@/lib/dexie/helper";
import Room from "@/lib/dexie/Room";

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
      name: (value: string) => (value ? null : "Room name is required"),
    },
  });

  if (!racks || !moreInfos) {
    return null;
  }

  return (
    <>
      <form
        onSubmit={form.onSubmit(({ name, comment }) => {
          room.name = name;
          room.comment = comment;
          onSave(room);
        })}
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
            onSaveRack={(rack) => rack.save()}
            onSaveMoreInfo={(moreInfo) => moreInfo.save()}
            onClear={() => room.clearRoomTools()}
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
