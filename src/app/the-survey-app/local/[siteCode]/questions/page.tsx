//import { getSite } from "@/app/utils";
import { QuestionList } from "@/components/Questions/QuestionList";
import { SiteCode } from "@/lib/types/sites";

export default async function ListPage({
  params: { siteCode },
}: {
  params: { siteCode: SiteCode };
}) {
  return <QuestionList siteCode={siteCode} />;
}
