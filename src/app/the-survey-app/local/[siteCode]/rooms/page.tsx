//import { getSite } from "@/app/utils";
import RoomList from "@/components/Rooms/RoomList";
import { dummyRooms } from "@/lib/data/rooms";
import { SiteCode } from "@/lib/types/sites";

export default async function ProcessesPage({
  params: { siteCode },
}: {
  params: { siteCode: SiteCode };
}) {
  console.log(siteCode);
  //const site = await getSite(siteCode);
  const rooms = dummyRooms;
  return <RoomList items={rooms} />;
}
