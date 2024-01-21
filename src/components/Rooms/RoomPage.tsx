"use client";

// Extracting Room Page client component code to a separate component so we can use
// Rooms/id/page component as server component
import RoomComponent from "@/components/Rooms/Room";
import { NewRoom, Room } from "@/lib/types/rooms";
import { Card, Stack, Title } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomPage({ room }: { room: Room | NewRoom }) {
  const [currentRoom, setCurrentRoom] = useState(room);
  const [files, handlers] = useListState<File>([]);
  const [roomPlan, setRoomPlan] = useState<File>();
  const router = useRouter();

  const handleSave = (room: Partial<Room>) => {
    setCurrentRoom((prevState) => {
      const newRoom = Object.assign({}, prevState);
      return { ...newRoom, ...room };
    });
    //navigate to rooomslist
    router.push("./");
  };
  const handleDelete = (room: Room) => {
    console.log("delete", room);
    router.push("./");
  };
  const handleSelectFiles = (newFiles: File[]) => {
    handlers.append(...newFiles);
  };
  const handleDeleteFile = (i: number) => {
    handlers.remove(i);
  };
  const handleSaveDrawing = (file: File) => {
    // TODO save to indexedDB
    setRoomPlan(file);
  };
  return (
    <Stack mb="80">
      <Title order={2}>{currentRoom.name}</Title>
      <Card withBorder shadow="sm" radius="md">
        <RoomComponent
          room={currentRoom}
          plan={roomPlan}
          onSaveDrawing={handleSaveDrawing}
          onSave={handleSave}
          onDelete={handleDelete}
          files={files}
          onSelectFiles={handleSelectFiles}
          onDeleteFile={handleDeleteFile}
        />
      </Card>
    </Stack>
  );
}
