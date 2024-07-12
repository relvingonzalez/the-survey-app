import RoomPage from "@/components/Rooms/RoomPage";
import { SiteCode } from "@/lib/types/sites";

export default async function ExistingRoomPage({
  params: { id, siteCode },
}: {
  params: { id: string; siteCode: SiteCode };
}) {
  return <RoomPage id={parseInt(id)} siteCode={siteCode} />;
}
