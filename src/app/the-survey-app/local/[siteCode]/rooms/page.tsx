//import { getSite } from "@/app/utils";
import RoomList from "@/components/Rooms/RoomList";
import { SiteCode } from "@/lib/types/sites";

export default async function ProcessesPage({
  params: { siteCode },
}: {
  params: { siteCode: SiteCode };
}) {
  return <RoomList siteCode={siteCode} />;
}
