"use client";

import { ModalProps } from "@mantine/core";
import { useEffect, useState } from "react";
import { getUpdatedComments, updateCommentIds } from "@/lib/dexie/helper";
import { saveComments } from "@/lib/api/actions";
import DownloadModal from "./DownloadModal";
import {
  IconListCheck,
  IconDatabase,
  IconDeviceSdCard,
} from "@tabler/icons-react";

const initialText =
  "You are syncing your local data to the server - that might override anything that was done before.";

const steps = [
  { icon: IconListCheck, label: "Step 1", description: "Verifying" },
  { icon: IconDatabase, label: "Step 2", description: "Saving" },
  { icon: IconDeviceSdCard, label: "Step 3", description: "Finishing" },
];

export default function SyncModal({ opened, ...props }: ModalProps) {
  // get all edited or new comments
  // Try server action
  const [statusText, setStatusText] = useState(initialText);
  const [progressValue, setProgressValue] = useState(0);
  const [active, setActive] = useState(0);
  const handleStatusUpdate = (step: number, progress: number, text: string) => {
    setActive(step);
    setStatusText(text);
    setProgressValue(progress);
  };
  const sync = async () => {
    const comments = await getUpdatedComments();
    if (comments.length) {
      handleStatusUpdate(1, 15, "Syncing Comments...");
      const commentsResult = await saveComments(comments);
      updateCommentIds(commentsResult).then(() => {
        handleStatusUpdate(3, 100, "Syncing Complete!");
      });
    }
    // sync responses
    // sync rooms
    // sync moreInfo
    // sync racks
    // sync hardware
  };
  const handleOnContinue = () => {
    handleStatusUpdate(1, 1, "Syncing...");
    sync();
  };
  useEffect(() => {
    if (opened) {
      setStatusText(initialText);
      setProgressValue(0);
    }
  }, [opened]);

  return (
    <DownloadModal
      active={active}
      statusText={statusText}
      progressValue={progressValue}
      onContinue={handleOnContinue}
      opened={opened}
      showButtons
      title="Syncing"
      steps={steps}
      {...props}
    />
  );
}
