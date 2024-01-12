import {
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  ModalRoot,
} from "@mantine/core";
import Drawing from "./Drawing";
import { useState } from "react";
import DrawingToolBox from "./DrawingToolBox";
import { useElementSize, useViewportSize } from "@mantine/hooks";

export type DrawingModalProps = ModalProps & {
  file?: File;
  onSave?: () => void;
};

export default function DrawingModal({
  onClose,
  onSave,
  ...props
}: DrawingModalProps) {
  const [selectedColor, setSelectedColor] = useState("#2e2e2e");
  const [activeTool, setActiveTool] = useState("line");
  const { ref, height } = useElementSize();
  const { width, height: viewportHeight } = useViewportSize();
  console.log(width, height, viewportHeight);

  return (
    <ModalRoot {...props} onClose={onClose} fullScreen>
      <ModalOverlay backgroundOpacity={0.55} blur={3} />
      <ModalContent>
        <ModalHeader bg="gray.2" ref={ref}>
          <DrawingToolBox
            onClose={onClose}
            onSave={onSave}
            onSelectColor={setSelectedColor}
            onSelectTool={setActiveTool}
            activeTool={activeTool}
            selectedColor={selectedColor}
          />
        </ModalHeader>
        <ModalBody p="0">
          <Drawing width={width} height={viewportHeight - height} />
        </ModalBody>
      </ModalContent>
    </ModalRoot>
  );
}
