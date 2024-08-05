"use client";

import { ModalProps } from "@mantine/core";
import {
  IconListCheck,
  IconDatabase,
  IconDeviceSdCard,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import DownloadModal from "./DownloadModal";
import {
  Comment,
  Hardware,
  MoreInfo,
  Rack,
  Response,
  ResponseGroup,
  Room,
} from "../../internal";

type StatusHandler = (step: number, progress: number, message: string) => void;

const initialText =
  "You are syncing your local data to the server - that might override anything that was done before.";

const steps = [
  { icon: IconListCheck, label: "Step 1", description: "Verifying" },
  { icon: IconDatabase, label: "Step 2", description: "Saving" },
  { icon: IconDeviceSdCard, label: "Step 3", description: "Finishing" },
];

const sync = async (handleStatusUpdate: StatusHandler) => {
  const progressValue = 0;
  handleStatusUpdate(1, 1, "Syncing...");

  handleStatusUpdate(
    2,
    progressValue + 5,
    "Syncing Collection Response Groups...",
  );
  await ResponseGroup.sync();
  handleStatusUpdate(
    2,
    progressValue + 10,
    "Syncing Response Groups Complete!",
  );

  handleStatusUpdate(1, progressValue + 5, "Syncing Comments...");
  await Comment.sync();
  handleStatusUpdate(2, progressValue + 10, "Syncing Comments Complete!");

  handleStatusUpdate(1, progressValue + 5, "Syncing Responses...");
  await Response.sync();
  handleStatusUpdate(2, progressValue + 10, "Syncing Responses Complete!");

  handleStatusUpdate(1, progressValue + 5, "Syncing Rooms...");
  await Room.sync();
  handleStatusUpdate(2, progressValue + 10, "Syncing Rooms Complete!");

  handleStatusUpdate(1, progressValue + 5, "Syncing Racks...");
  await Rack.sync();
  handleStatusUpdate(2, progressValue + 10, "Syncing Racks Complete!");

  handleStatusUpdate(1, progressValue + 5, "Syncing Hardwares...");
  await Hardware.sync();
  handleStatusUpdate(2, progressValue + 10, "Syncing Hardwares Complete!");

  handleStatusUpdate(1, progressValue + 5, "Syncing MoreInfos...");
  await MoreInfo.sync();
  handleStatusUpdate(2, progressValue + 10, "Syncing MoreInfos Complete!");
};

export function SyncModal({ opened, ...props }: ModalProps) {
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

  const handleOnContinue = () => {
    sync(handleStatusUpdate);
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
