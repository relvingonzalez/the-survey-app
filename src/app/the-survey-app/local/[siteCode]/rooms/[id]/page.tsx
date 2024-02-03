//import { getSite } from "@/app/utils";
import { dummyRoom } from "@/lib/data/rooms";
import { SiteCode } from "@/lib/types/sites";
import RoomPage from "@/components/Rooms/RoomPage";

export default async function ExistingRoomPage({
  params: { siteCode },
}: {
  params: { siteCode: SiteCode };
}) {
  console.log(siteCode);
  //const site = await getSite(siteCode);
  const room = dummyRoom;

  return <RoomPage room={room} />;
}
