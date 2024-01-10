"use client";

import { ModalProps, Text } from "@mantine/core";
import ProgressModal from "./ProgressModal";
import { useEffect, useState } from "react";

const initialText =
  "You are syncing your local data to the server - that might override anything that was done before.";

export default function SyncModal({ opened, ...props }: ModalProps) {
  const [statusText, setStatusText] = useState(initialText);
  const [progressValue, setProgressValue] = useState(0);
  const handleOnContinue = () => {
    setStatusText("Syncing...");
    setProgressValue(1);
  };
  useEffect(() => {
    if (opened) {
      setStatusText(initialText);
      setProgressValue(0);
    }
  }, [opened]);

  return (
    <ProgressModal
    statusText={statusText}
    progressValue={progressValue}
    onContinue={handleOnContinue}
    opened={opened}
    showButtons
    title={<Text>Syncing</Text>}
    {...props}
    ></ProgressModal>
  );
}
