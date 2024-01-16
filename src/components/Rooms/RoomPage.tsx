"use client";

// Extracting Room Page client component code to a separate component so we can use
// Rooms/id/page component as server component
import RoomComponent from "@/components/Rooms/Room";
import { NewRoom, Room } from "@/lib/types/rooms";
import { Card, Stack, Title } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useState } from "react";

export default function RoomPage({ room }: { room: Room | NewRoom }) {
  const [currentRoom, setCurrentRoom] = useState(room);
  //const [files, setFiles] = useState<File[]>([]);
  const [files, handlers] = useListState<File>([]);

  const handleSave = (room: Partial<Room>) => {
    console.log("save", room);
    setCurrentRoom((prevState) => {
      const newRoom = Object.assign({}, prevState);
      return { ...newRoom, ...room };
    });
    //navigate to rooomslist
  };
  const handleDelete = (room: Room) => {
    console.log("delete", room);
  };
  const handleSelectFiles = (newFiles: File[]) => {
    handlers.append(...newFiles);
  };
  const handleDeleteFile = (i: number) => {
    handlers.remove(i);
  };
  return (
    <Stack mb="80">
      <Title order={2}>{currentRoom.name}</Title>
      <Card withBorder shadow="sm" radius="md">
        <RoomComponent
          room={currentRoom}
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
