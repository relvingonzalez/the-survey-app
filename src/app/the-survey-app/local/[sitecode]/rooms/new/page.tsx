//import { getSite } from "@/app/utils";
import { SiteCode } from "@/lib/types/sites";
import RoomPage from "@/components/Rooms/RoomPage";
import { createRoom } from "@/lib/utils/functions";

export default async function NewRoomPage({
  params: { siteCode },
}: {
  params: { siteCode: SiteCode };
}) {
  console.log(siteCode);
  //const site = await getSite(siteCode);

  return <RoomPage room={createRoom()} />;
}
