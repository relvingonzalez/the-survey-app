import {
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  ModalRoot,
} from "@mantine/core";
import Drawing from "./Drawing";
import { useEffect, useRef, useState } from "react";
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
  const [selectedColor, setSelectedColor] = useState("#2e2e2e");
  const [activeTool, setActiveTool] = useState("line");
  const [canvasHeight, setCanvasHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setCanvasHeight(window.innerHeight - ref.current.clientHeight);
    }
  }, []);

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
        <ModalBody>
          <Drawing height={canvasHeight} />
        </ModalBody>
      </ModalContent>
    </ModalRoot>
  );
}
