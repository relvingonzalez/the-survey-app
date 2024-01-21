"use client";

import { Flex, Stack, Title } from "@mantine/core";
import { useState } from "react";
import ClickableDrawing from "../Drawing/ClickableDrawing";
import { SiteCode } from "@/lib/types/sites";

export type SignaturesPageProps = {
  siteCode?: SiteCode;
};

export default function SignaturesPage({ siteCode }: SignaturesPageProps) {
  console.log(siteCode);
  const eSignature = new File([], "engineer.jpg");
  const cSignature = new File([], "customer.jpg");

  const [engineerSignature, setEngineerSignature] = useState<File | undefined>(
    eSignature,
  );
  const [customerSignature, setCustomerSignature] = useState<File | undefined>(
    cSignature,
  );

  const handleSaveEngineerSignature = (file: File) => {
    setEngineerSignature(file);
  };
  const handleSaveCustomerSignature = (file: File) => {
    setCustomerSignature(file);
  };

  return (
    <>
      <Title order={2}>Sign Off</Title>
      <Flex gap="md">
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
