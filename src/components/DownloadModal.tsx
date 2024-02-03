import { Stepper, StepperStep, rem } from "@mantine/core";
import ProgressModal, { ProgressModalProps } from "./ProgressModal";
import {
  IconCircleCheck,
  IconDeviceSdCard,
  IconDatabase,
  IconListCheck,
} from "@tabler/icons-react";

export type DownloadModalProps = ProgressModalProps & {
  active: number;
};

export default function DownloadModal({
  active,
  ...props
}: DownloadModalProps) {
  return (
    <ProgressModal size="xl" showButtons title="Syncing" {...props}>
      <Stepper
        active={active}
        completedIcon={
          <IconCircleCheck style={{ width: rem(18), height: rem(18) }} />
        }
      >
        <StepperStep
          icon={<IconListCheck style={{ width: rem(18), height: rem(18) }} />}
          label="Step 1"
          description="Verifying"
        />
        <StepperStep
          icon={<IconDatabase style={{ width: rem(18), height: rem(18) }} />}
          label="Step 2"
          description="Downloading"
        />
        <StepperStep
          icon={
            <IconDeviceSdCard style={{ width: rem(18), height: rem(18) }} />
          }
          label="Step 3"
          description="Saving"
        />
      </Stepper>
    </ProgressModal>
  );
}
