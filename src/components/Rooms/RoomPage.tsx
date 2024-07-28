"use client";

// Extracting Room Page client component code to a separate component so we can use
// Rooms/id/page component as server component
import RoomComponent from "@/components/Rooms/Room";
import { Card, Stack, Title } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/dexie/db";
import { SiteCode } from "@/lib/types/sites";
import { getRoomById } from "@/lib/dexie/helper";
import { DexieRoom } from "@/lib/types/dexie";
import Room from "@/lib/dexie/Room";

export type RoomPageProps = {
  id?: number;
  siteCode: SiteCode;
};

export default function RoomPage({ id, siteCode }: RoomPageProps) {
  const site = useLiveQuery(() => db.siteProjects.get({ siteCode }));
  const projectId = site ? site.projectId : 0;
  const room = useLiveQuery(() => getRoomById(projectId, id), [projectId, id]);
  const [files, handlers] = useListState<File>([]);
  const [roomPlan, setRoomPlan] = useState<File>();
  const router = useRouter();

  const handleSave = (room: DexieRoom) => {
    room.save();
    router.push("./");
  };
  const handleDelete = (room: Room) => {
    room.delete();
    router.push("./");
  };
  const handleSelectFiles = (newFiles: File[]) => {
    handlers.append(...newFiles);
  };
  const handleDeleteFile = (i: number) => {
    handlers.remove(i);
  };
  const handleSaveDrawing = (file: File) => {
    // TODO: save to indexedDB
    setRoomPlan(file);
  };

  if (!room) {
    return null;
  }

  return (
    <Stack mb="80">
      <Title order={2}>{room.name}</Title>
      <Card withBorder shadow="sm" radius="md">
        <RoomComponent
          room={room}
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
