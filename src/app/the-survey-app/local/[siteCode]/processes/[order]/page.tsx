//import { getSite } from "@/app/utils";

import { Process } from "@/components/Questions/SurveyItem";
import { SiteCode } from "@/lib/types/sites";

export default async function QuestionPage({
  params: { siteCode, order },
}: {
  params: { siteCode: SiteCode; order: string };
}) {
  return <Process siteCode={siteCode} order={parseInt(order)} />;
}
