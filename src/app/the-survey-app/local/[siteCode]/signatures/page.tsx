//import { getSite } from "@/app/utils";
import { SiteCode } from "@/lib/types/sites";
import SignaturesPage from "@/components/Signatures/SignaturesPage";

export default async function ExistingRoomPage({
  params: { siteCode },
}: {
  params: { siteCode: SiteCode };
}) {
  console.log(siteCode);

  return <SignaturesPage siteCode={siteCode} />;
}
