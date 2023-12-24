import { getSite } from "@/app/utils";
import SiteOverview from "@/components/Sites/SiteOverview";
import { dummySite } from "@/lib/data/sites";
import { SiteCode } from "@/lib/types/sites";

export default async function SiteOverviewPage({
  params: { siteCode },
}: {
  params: { siteCode: SiteCode }
}) {
  //const site = await getSite(siteCode);
  const site = dummySite;
    return (
        <SiteOverview site={site} />
      );
}