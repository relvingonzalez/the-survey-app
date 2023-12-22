import { Button, Group, Modal, ModalProps, Progress } from '@mantine/core';

export type ProgressModalProps = ModalProps & {
    progressValue: number;
    statusText: string;
    showButtons?: boolean;
    onContinue?: () => void;
}

export default function ProgressModal({progressValue, statusText, showButtons, onClose, onContinue, ...props}: ProgressModalProps) {

  return (
      <Modal {...props}
        overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
        }}
        size="xl"
        title="Syncing"
        onClose={onClose}>
            {statusText}
            <Progress value={progressValue} />

        {showButtons && <Group mt="xl">
          <Button disabled={progressValue > 0 && progressValue < 100} onClick={onClose}>Close</Button>
          <Button disabled={progressValue > 0 && progressValue < 100} onClick={onContinue}>Continue</Button>
        </Group>}
      </Modal>
  );
}