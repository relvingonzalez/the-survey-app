"use client";

import { Flex, Stack, Title } from "@mantine/core";
import ClickableDrawing from "../Drawing/ClickableDrawing";
import { SiteCode } from "@/lib/types/sites";
import { useLiveQuery } from "dexie-react-hooks";
import { db, SurveyFile } from "../../../internal";

export type SignaturesPageProps = {
  siteCode?: SiteCode;
};

export default function SignaturesPage({ siteCode }: SignaturesPageProps) {
  const site = useLiveQuery(() => db.siteProjects.get({ siteCode }));
  const projectId = site ? site.projectId : 0;

  const engineerSignature = useLiveQuery(
    () => SurveyFile.getSignatureByType(projectId, "engineer"),
    [projectId],
  );

  const customerSignature = useLiveQuery(
    () => SurveyFile.getSignatureByType(projectId, "customer"),
    [projectId],
  );

  const handleSaveEngineerSignature = (file: File) => {
    if (engineerSignature) {
      engineerSignature.file = file;
      engineerSignature.localId ? engineerSignature.save() : SurveyFile.add(engineerSignature);
    }
  };
  const handleSaveCustomerSignature = (file: File) => {
    if (customerSignature) {
      customerSignature.file = file;
      customerSignature.localId ? customerSignature.save() : SurveyFile.add(customerSignature);
    }
  };

  return (
    <>
      <Title order={2}>Sign Off</Title>
      <Flex gap="md" wrap="wrap">
        <Stack>
          <Title order={3}>Engineer</Title>
          <ClickableDrawing
            fallbackSrc="/signature_placeholder.svg"
            file={engineerSignature}
            onSaveDrawing={handleSaveEngineerSignature}
            isSignature
          />
        </Stack>

        <Stack>
          <Title order={3}>Customer</Title>
          <ClickableDrawing
            fallbackSrc="/signature_placeholder.svg"
            file={customerSignature}
            onSaveDrawing={handleSaveCustomerSignature}
            isSignature
          />
        </Stack>
      </Flex>
    </>
  );
}
