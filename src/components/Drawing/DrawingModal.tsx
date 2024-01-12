import { Modal, ModalProps, Stack } from "@mantine/core";
import Drawing from "./Drawing";
import { useRef, useState } from "react";
import DrawingToolBox from "./DrawingToolBox";

export type DrawingModalProps = ModalProps & {
  file?: File;
  onSave?: () => void;
};

export default function DrawingModal({
  onClose,
  onSave,
  ...props
}: DrawingModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [activeTool, setActiveTool] = useState("line");

  return (
    <Modal
      {...props}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      onClose={onClose}
      fullScreen
      ref={ref}
      withCloseButton={false}
    >
      <Stack align="center">
        <DrawingToolBox
          onClose={onClose}
          onSave={onSave}
          onSelectColor={setSelectedColor}
          onSelectTool={setActiveTool}
          activeTool={activeTool}
          selectedColor={selectedColor}
        />
        <Drawing />
      </Stack>
    </Modal>
  );
}
