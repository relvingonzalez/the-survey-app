import SiteOverview from "@/components/Sites/SiteOverview";
import { SiteCode } from "@/lib/types/sites";

export default async function SiteOverviewPage({
  params: { siteCode },
}: {
  params: { siteCode: SiteCode };
}) {
  return <SiteOverview siteCode={siteCode} />;
}
