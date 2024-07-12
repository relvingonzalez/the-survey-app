//import { getSite } from "@/app/utils";
import { SiteCode } from "@/lib/types/sites";
import RoomPage from "@/components/Rooms/RoomPage";

export default async function NewRoomPage({
  params: { siteCode },
}: {
  params: { siteCode: SiteCode };
}) {
  return <RoomPage siteCode={siteCode} />;
}
