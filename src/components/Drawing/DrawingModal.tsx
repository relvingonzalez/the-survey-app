import {
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  ModalRoot,
} from "@mantine/core";
import Drawing from "./Drawing";
import { useRef, useState } from "react";
import DrawingToolBox, { defaultTools } from "./DrawingToolBox";
import {
  useDisclosure,
  useElementSize,
  useListState,
  useViewportSize,
} from "@mantine/hooks";
import { MoreInfo, Rack } from "@/lib/types/rooms";
import MoreInfoModal from "./CustomTools/MoreInfo/MoreInfoModal";
import { IconInfoCircleFilled, IconServer2 } from "@tabler/icons-react";
import RackModal from "./CustomTools/Rack/RackModal";

export type CustomTools = {
  racks?: Rack[];
  moreInfo?: MoreInfo[];
};

export type DrawingModalProps = ModalProps &
  CustomTools & {
    file?: File;
    onSave?: (files: File[]) => void;
  };

export default function DrawingModal({
  onClose,
  onSave,
  racks = [],
  moreInfo = [],
  ...props
}: DrawingModalProps) {
  const [selectedColor, setSelectedColor] = useState("#2e2e2e");
  const [activeTool, setActiveTool] = useState("line");
  const { ref, height } = useElementSize(); // elementSize does not have top and bottom padding, so I had to add 32
  const { width, height: viewportHeight } = useViewportSize();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [moreInfoModalOpened, { open: moreInfoOpen, close: moreInfoClose }] =
    useDisclosure(false);
  const [rackModalOpened, { open: rackOpen, close: rackClose }] =
    useDisclosure(false);
  const [localRacks, handlersRack] = useListState<Rack>(racks);
  const [localMoreInfo, handlersMoreInfo] = useListState<MoreInfo>(moreInfo);
  const customTools = [
    {
      label: "More Info",
      value: "moreInfo",
      icon: IconInfoCircleFilled,
      onMouseUp: (
        selectedColor: string,
        ctx: CanvasRenderingContext2D,
        startX: number,
        startY: number,
        x: number,
        y: number,
      ) => handlersMoreInfo.append({ info: "", x: x - 12, y: y - 12 }),
    },
    {
      label: "Rack",
      value: "rack",
      icon: IconServer2,
      onMouseUp: (
        selectedColor: string,
        ctx: CanvasRenderingContext2D,
        startX: number,
        startY: number,
        x: number,
        y: number,
      ) =>
        handlersRack.append({
          rackName: "",
          rackList: [],
          rackComment: "",
          x: x - 12,
          y: y - 12,
        }),
    },
  ];
  const tools = [...defaultTools, ...customTools];
  const handleClear = () => {
    handlersRack.setState([]);
    handlersMoreInfo.setState([]);
  };

  return (
    <>
      {localMoreInfo[0] && (
        <MoreInfoModal
          onClose={moreInfoClose}
          onSave={moreInfoClose}
          opened={moreInfoModalOpened}
          moreInfo={localMoreInfo[0]}
          existingFiles={[]}
        />
      )}
      {localRacks[0] && (
        <RackModal
          onClose={rackClose}
          onSave={rackClose}
          opened={rackModalOpened}
          rack={localRacks[0]}
          existingFiles={[]}
        />
      )}
      <ModalRoot {...props} onClose={onClose} fullScreen>
        <ModalOverlay backgroundOpacity={0.55} blur={3} />
        <ModalContent>
          <ModalHeader bg="gray.2" ref={ref}>
            <DrawingToolBox
              canvasRef={canvasRef}
              onClear={handleClear}
              onClose={onClose}
              onSave={onSave}
              onSelectColor={setSelectedColor}
              onSelectTool={setActiveTool}
              activeTool={activeTool}
              selectedColor={selectedColor}
              tools={tools}
            />
          </ModalHeader>
          <ModalBody p="0">
            <Drawing
              activeTool={activeTool}
              canvasRef={canvasRef}
              height={viewportHeight - height - 32}
              selectedColor={selectedColor}
              width={width}
              tools={tools}
            >
              {localMoreInfo.map((mI, i) => (
                <IconInfoCircleFilled
                  key={i}
                  style={{ position: "absolute", left: mI.x, top: mI.y }}
                  onClick={moreInfoOpen}
                />
              ))}

              {localRacks.map((r, i) => (
                <IconServer2
                  key={i}
                  style={{ position: "absolute", left: r.x, top: r.y }}
                  onClick={rackOpen}
                />
              ))}
            </Drawing>
          </ModalBody>
        </ModalContent>
      </ModalRoot>
    </>
  );
}
