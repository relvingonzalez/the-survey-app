import { getSite } from "@/app/utils";
import QuestionList from "@/components/Questions/QuestionList";
import { dummyQuestions } from "@/lib/data/questions";
import { dummySite } from "@/lib/data/sites";
import { SiteCode } from "@/lib/types/sites";

export default async function ListPage({
  params: { siteCode },
}: {
  params: { siteCode: SiteCode }
}) {
  //const site = await getSite(siteCode);
  const questions = dummyQuestions;
    return (
        <QuestionList items={dummyQuestions} />
      );
}