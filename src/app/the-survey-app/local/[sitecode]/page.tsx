import SiteOverview from "@/components/Sites/SiteOverview";
import { dummyQuestions } from "@/lib/data/questions";
import { dummySite } from "@/lib/data/sites";
import { SiteCode } from "@/lib/types/sites";

export default async function SiteOverviewPage({
  params: { siteCode },
}: {
  params: { siteCode: SiteCode };
}) {
  console.log(siteCode);
  //const site = await getSite(siteCode);
  const site = dummySite;
  return (
    <SiteOverview
      questions={dummyQuestions}
      processes={dummyQuestions}
      site={site}
    />
  );
}
