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
  title = <Text>Download</Text>,
  ...props
}: ProgressModalProps) {
  return (
    <Modal
      {...props}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      size="xl"
      title={title}
      onClose={onClose}
    >
      <Text>{statusText}</Text>
      <Progress value={progressValue} />

      {showButtons && (
        <Group mt="xl">
          <Button
            disabled={progressValue > 0 && progressValue < 100}
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            disabled={progressValue > 0 && progressValue < 100}
            onClick={onContinue}
          >
            Continue
          </Button>
        </Group>
      )}
    </Modal>
  );
}
