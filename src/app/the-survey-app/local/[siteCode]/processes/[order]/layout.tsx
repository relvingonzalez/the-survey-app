//import { getSite } from "@/app/utils";

import QuestionLayout from "@/components/Questions/QuestionLayout";
import { SiteCode } from "@/lib/types/sites";

export default async function ProcessLayoutPage({
  children,
  params: { siteCode, order },
}: {
  children: React.ReactNode;
  params: { siteCode: SiteCode; order: string };
}) {
  return (
    <QuestionLayout siteCode={siteCode} order={parseInt(order)}>
      {children}
    </QuestionLayout>
  );
}
