import {
  Button,
  Group,
  Modal,
  ModalProps,
  Progress,
  Text,
} from "@mantine/core";

export type ProgressModalProps = ModalProps & {
  progressValue: number;
  statusText: string;
  showButtons?: boolean;
  onContinue?: () => void;
};

export default function ProgressModal({
  progressValue,
  statusText,
  showButtons,
  onClose,
  onContinue,
  children,
  title = "Download",
  ...props
}: ProgressModalProps) {
  return (
    <Modal
      {...props}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      title={title}
      onClose={onClose}
    >
      {children}
      <Text mt="40" mb="20">
        {statusText}
      </Text>
      <Progress value={progressValue} />

      {showButtons && (
        <Group mt="xl">
          <Button
            disabled={progressValue > 10 && progressValue < 100}
            onClick={onClose}
          >
            Close
          </Button>
          {progressValue <= 10 && (
            <Button variant="danger" onClick={onContinue}>
              Continue
            </Button>
          )}
        </Group>
      )}
    </Modal>
  );
}
