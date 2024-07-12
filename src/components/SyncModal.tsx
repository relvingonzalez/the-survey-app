"use client";

import { ModalProps } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  getUpdatedComments,
  getUpdatedResponseGroups,
  getUpdatedResponses,
  updateCommentIds,
  updateResponseGroupIds,
} from "@/lib/dexie/helper";
import {
  saveComments,
  saveResponseGroup,
  saveResponses,
} from "@/lib/api/actions";
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
    setProgressValue(progress <= 100 ? progress : 100);
  };
  const sync = async () => {
    const responseGroups = await getUpdatedResponseGroups();
    if (responseGroups.length) {
      handleStatusUpdate(
        2,
        progressValue + 5,
        "Syncing Collection Response Groups...",
      );

      await Promise.all(
        responseGroups.map(async (r) => {
          const [savedResponseGroup] = await saveResponseGroup(r);
          return updateResponseGroupIds(r.id, savedResponseGroup.id);
        }),
      );

      handleStatusUpdate(
        2,
        progressValue + 10,
        "Syncing Response Groups Complete!",
      );
    }

    const comments = await getUpdatedComments();
    if (comments.length) {
      handleStatusUpdate(1, progressValue + 5, "Syncing Comments...");
      const [commentsResult] = await saveComments(comments);
      await updateCommentIds(commentsResult);
      handleStatusUpdate(2, progressValue + 10, "Syncing Comments Complete!");
    }

    const responses = await getUpdatedResponses();
    if (responses.length) {
      const savedResponses = await saveResponses(responses);
      console.log("saved are:", savedResponses);
      handleStatusUpdate(2, progressValue + 10, "Syncing Responses Complete!");
    }

    handleStatusUpdate(3, 100, "Syncing Complete!");

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
