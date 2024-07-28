"use client";

import { ModalProps } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  getGroupedUpdatedAndSerializedResponses,
  getUpdatedComments,
  getUpdatedHardwares,
  getUpdatedMoreInfos,
  getUpdatedRacks,
  getUpdatedRooms,
  updateHardwareIds,
  updateMoreInfoIds,
  updateRackIds,
  updateRoomIds,
  getUpdatedResponseGroups,
  updateCommentIds,
  updateResponseGroupIds,
} from "@/lib/dexie/helper";
import {
  saveComments,
  saveResponseGroup,
  saveResponses,
  saveRoom,
  saveRack,
  saveHardware,
  saveMoreInfo,
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
    // sync response groups for collection questions
    const responseGroups = await getUpdatedResponseGroups();
    if (responseGroups.length) {
      handleStatusUpdate(
        2,
        progressValue + 5,
        "Syncing Collection Response Groups...",
      );

      await Promise.all(
        responseGroups.map(async (r) => {
          const [savedResponseGroup] = await saveResponseGroup(r.serialize());
          return updateResponseGroupIds(r.id, savedResponseGroup.id);
        }),
      );

      handleStatusUpdate(
        2,
        progressValue + 10,
        "Syncing Response Groups Complete!",
      );
    }

    // sync main responses with comments
    const comments = await getUpdatedComments();
    if (comments.length) {
      handleStatusUpdate(1, progressValue + 5, "Syncing Comments...");
      const [commentsResult] = await saveComments(
        comments.map((c) => c.serialize()),
      );
      await updateCommentIds(commentsResult);
      handleStatusUpdate(2, progressValue + 10, "Syncing Comments Complete!");
    }

    // sync responses types
    const responsesGroupedByType =
      await getGroupedUpdatedAndSerializedResponses();
    const savedResponses = await saveResponses(responsesGroupedByType);
    console.log(savedResponses);
    // await updateResponseIds(savedResponses);
    handleStatusUpdate(2, progressValue + 10, "Syncing Responses Complete!");

    // // sync rooms
    const rooms = await getUpdatedRooms();
    if (rooms.length) {
      handleStatusUpdate(1, progressValue + 5, "Syncing Rooms...");
      await Promise.all(
        rooms.map(async (r) => {
          const savedRoom = await saveRoom(r.serialize());
          await updateRoomIds(r, savedRoom);
        }),
      );

      handleStatusUpdate(2, progressValue + 10, "Syncing Rooms Complete!");
    }

    // sync racks
    const racks = await getUpdatedRacks();
    if (racks.length) {
      handleStatusUpdate(1, progressValue + 5, "Syncing Racks...");
      await Promise.all(
        racks.map(async (r) => {
          const savedRack = await saveRack(r.serialize());
          await updateRackIds(r, savedRack);
        }),
      );

      handleStatusUpdate(2, progressValue + 10, "Syncing Rooms Complete!");
    }
    // sync hardware
    const hardwares = await getUpdatedHardwares();
    if (hardwares.length) {
      handleStatusUpdate(1, progressValue + 5, "Syncing Hardware...");
      await Promise.all(
        hardwares.map(async (r) => {
          const savedHardware = await saveHardware(r.serialize());
          await updateHardwareIds(r, savedHardware);
        }),
      );
      handleStatusUpdate(2, progressValue + 10, "Syncing Hardwares Complete!");
    }

    // sync moreInfo
    const moreInfos = await getUpdatedMoreInfos();
    if (moreInfos.length) {
      handleStatusUpdate(1, progressValue + 5, "Syncing More Infos...");
      await Promise.all(
        moreInfos.map(async (m) => {
          const savedMoreInfo = await saveMoreInfo(m.serialize());
          await updateMoreInfoIds(m, savedMoreInfo);
        }),
      );
      handleStatusUpdate(2, progressValue + 10, "Syncing Hardwares Complete!");
    }

    handleStatusUpdate(3, 100, "Syncing Complete!");
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
