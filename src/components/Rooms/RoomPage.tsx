"use client";

// Extracting Room Page client component code to a separate component so we can use
// Rooms/id/page component as server component
import RoomComponent from "@/components/Rooms/Room";
import { Card, Stack, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/dexie/db";
import { SiteCode } from "@/lib/types/sites";
import { Room, SurveyFile } from "../../../internal";
export type RoomPageProps = {
  id?: number;
  siteCode: SiteCode;
};

export default function RoomPage({ id, siteCode }: RoomPageProps) {
  const site = useLiveQuery(() => db.siteProjects.get({ siteCode }));
  const projectId = site ? site.projectId : 0;
  const room = useLiveQuery(() => Room.getById(projectId, id), [projectId, id]);

  const router = useRouter();

  const roomPlan = useLiveQuery(
    () => room && SurveyFile.getPlanByRoom(room),
    [room],
    SurveyFile.create({ projectId, roomId: room?.id }),
  );

  const files = useLiveQuery(
    () => room && SurveyFile.getByRoom(room),
    [room],
    [],
  );

  if (!room || !files || !roomPlan) {
    return null;
  }

  // Check how to handle add or remove files before and after saving
  // What happens if removing or adding before saving.
  const handleDeleteFile = (i: number) => {
    files[i].delete();
  };
  const handleSelectFiles = (newFiles: File[]) => {
    const roomId = room.id;
    newFiles.map((f) => SurveyFile.add({ roomId, file: f }));
  };

  const handleSave = (room: Room) => {
    room.save();
    router.push("./");
  };
  const handleDelete = (room: Room) => {
    room.delete();
    router.push("./");
  };

  const handleSaveDrawing = (file: File) => {
    roomPlan.file = file;
    roomPlan.save();
  };

  // const [files, handlers] = useListState<File>([]);
  // const [roomPlan, setRoomPlan] = useState<File>();
  // const handleSelectFiles = (newFiles: File[]) => {
  //   handlers.append(...newFiles);
  // };
  // const handleDeleteFile = (i: number) => {
  //   handlers.remove(i);
  // };

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
