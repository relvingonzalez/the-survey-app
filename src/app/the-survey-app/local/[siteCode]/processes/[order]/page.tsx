//import { getSite } from "@/app/utils";

import Question from "@/components/Questions/SurveyItem";
import { SiteCode } from "@/lib/types/sites";

export default async function QuestionPage({
  params: { siteCode, order },
}: {
  params: { siteCode: SiteCode; order: string };
}) {
  return (
    <Question siteCode={siteCode} order={parseInt(order)} type="process" />
  );
}
