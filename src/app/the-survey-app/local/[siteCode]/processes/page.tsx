//import { getSite } from "@/app/utils";
import { ProcessList } from "@/components/Questions/QuestionList";
import { SiteCode } from "@/lib/types/sites";

export default async function ProcessesPage({
  params: { siteCode },
}: {
  params: { siteCode: SiteCode };
}) {
  return <ProcessList siteCode={siteCode} />;
}
