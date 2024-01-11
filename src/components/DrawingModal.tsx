import { Button, Group, Modal, ModalProps } from "@mantine/core";
import Drawing from "./Drawing/Drawing";
import { useRef } from "react";

export type DrawingModalProps = ModalProps & {
  file?: File;
  onContinue?: () => void;
};

export default function DrawingModal({
  onClose,
  onContinue,
  title = "Drawing",
  ...props
}: DrawingModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <Modal
      {...props}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      title={title}
      onClose={onClose}
      fullScreen
      ref={ref}
    >
      <Drawing width={"100%"} height={"100%"} />

      <Group mt="xl">
        <Button onClick={onClose}>Close</Button>
        <Button onClick={onContinue}>Save</Button>
      </Group>
    </Modal>
  );
}
