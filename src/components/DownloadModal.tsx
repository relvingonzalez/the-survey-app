import { Center, Loader, Stepper, StepperStep, rem } from "@mantine/core";
import ProgressModal, { ProgressModalProps } from "./ProgressModal";
import {
  IconCircleCheck,
  IconDeviceSdCard,
  IconDatabase,
  IconListCheck,
  IconCheck,
  Icon,
} from "@tabler/icons-react";

export type Step = {
  icon: Icon;
  label: string;
  description: string;
};

export type DownloadModalProps = ProgressModalProps & {
  active: number;
  steps?: Step[];
};

const defaultSteps = [
  { icon: IconListCheck, label: "Step 1", description: "Verifying" },
  { icon: IconDatabase, label: "Step 2", description: "Downloading" },
  { icon: IconDeviceSdCard, label: "Step 3", description: "Saving" },
];

export default function DownloadModal({
  active,
  progressValue,
  steps = defaultSteps,
  ...props
}: DownloadModalProps) {
  return (
    <ProgressModal
      size="xl"
      showButtons
      title="Syncing"
      progressValue={progressValue}
      {...props}
    >
      <Stepper
        active={active}
        completedIcon={
          <IconCircleCheck style={{ width: rem(18), height: rem(18) }} />
        }
      >
        {steps.map((s, i) => (
          <StepperStep
            key={i}
            icon={<s.icon style={{ width: rem(18), height: rem(18) }} />}
            label={s.label}
            color={active > i + 1 || progressValue === 100 ? "green" : "blue"}
            description={s.description}
          />
        ))}
      </Stepper>
      <Center mt="20">
        {progressValue < 100 && <Loader color="blue" />}
        {progressValue === 100 && <IconCheck color="green" />}
      </Center>
    </ProgressModal>
  );
}
