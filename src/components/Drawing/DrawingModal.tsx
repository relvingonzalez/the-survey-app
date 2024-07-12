import {
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  ModalRoot,
} from "@mantine/core";
import Drawing, { BackgroundImage } from "./Drawing";
import { useRef, useState } from "react";
import DrawingToolBox, { defaultTools } from "./DrawingToolBox";
import { useDisclosure, useElementSize, useViewportSize } from "@mantine/hooks";
import MoreInfoModal from "./CustomTools/MoreInfo/MoreInfoModal";
import { IconInfoCircleFilled, IconServer2 } from "@tabler/icons-react";
import RackModal from "./CustomTools/Rack/RackModal";
import { DexieRack, DexieMoreInfo, DexieHardware } from "@/lib/types/dexie";
import { Rack, Room } from "@/lib/types/rooms";
import { createMoreInfo, createRack } from "@/lib/utils/functions";
import { updateHardwareList } from "@/lib/dexie/helper";

export type CustomTools =
  | {
      isRoom: true;
      racks?: DexieRack[];
      moreInfos?: DexieMoreInfo[];
      room: Room;
      onSaveRack: (rack: DexieRack) => void;
      onSaveMoreInfo: (moreInfo: DexieMoreInfo) => void;
      onClear: () => void;
    }
  | {
      isRoom?: false;
      racks?: never;
      moreInfos?: never;
      room?: never;
      onSaveRack?: never;
      onSaveMoreInfo?: never;
      onClear?: never;
    };

export type DrawingModalProps = ModalProps &
  CustomTools &
  BackgroundImage & {
    file?: File;
    isSignature?: boolean;
    onSave?: (files: File[]) => void;
  };

export default function DrawingModal({
  onClose,
  onSave,
  backgroundImage,
  isRoom,
  isSignature,
  racks = [],
  moreInfos = [],
  onSaveRack,
  onSaveMoreInfo,
  onClear,
  room,
  ...props
}: DrawingModalProps) {
  const [selectedColor, setSelectedColor] = useState("#2e2e2e");
  const [activeTool, setActiveTool] = useState(
    isSignature ? "freeHand" : "line",
  );
  const { ref, height } = useElementSize(); // elementSize does not have top and bottom padding, so I had to add 32
  const { width, height: viewportHeight } = useViewportSize();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Modals
  const [moreInfoModalOpened, { open: moreInfoOpen, close: moreInfoClose }] =
    useDisclosure(false);
  const [rackModalOpened, { open: rackOpen, close: rackClose }] =
    useDisclosure(false);

  // Selected Custom Tool
  const [currentMoreInfo, setCurrentMoreInfo] = useState<DexieMoreInfo>(
    moreInfos[0],
  );
  const [currentRack, setCurrentRack] = useState<DexieRack>(racks[0]);

  // Custom Tool Definition
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
      ) => onSaveMoreInfo?.(createMoreInfo(room.id, x - 12, y - 12)),
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
      ) => onSaveRack?.(createRack(room.id, x - 12, y - 12)),
    },
  ];
  const tools = isRoom
    ? [...defaultTools, ...customTools]
    : isSignature
      ? defaultTools.filter((v) => v.value === "freeHand")
      : defaultTools;

  const handleMoreInfoOpen = (i: number) => {
    setCurrentMoreInfo(moreInfos[i]);
    moreInfoOpen();
  };
  const handleRackOpen = (i: number) => {
    setCurrentRack(racks[i]);
    rackOpen();
  };
  const handleSaveMoreInfo = (info: string) => {
    moreInfoClose();
    onSaveMoreInfo?.({
      ...currentMoreInfo,
      info,
      flag: currentMoreInfo.flag === "i" ? "i" : "u",
    });
  };
  const handleSaveRack = (rack: Rack) => {
    rackClose();
    onSaveRack?.({
      ...currentRack,
      ...rack,
      flag: currentRack.flag === "i" ? "i" : "u",
    });
  };
  const handleSaveHardware = (hardwareList: DexieHardware[]) => {
    updateHardwareList(hardwareList);
  };

  return (
    <>
      <MoreInfoModal
        onClose={moreInfoClose}
        onSave={handleSaveMoreInfo}
        opened={moreInfoModalOpened}
        moreInfo={currentMoreInfo}
        existingFiles={[]}
        zIndex={300}
      />

      {racks[0] && (
        <RackModal
          onClose={rackClose}
          onSave={handleSaveRack}
          onSaveHardware={handleSaveHardware}
          opened={rackModalOpened}
          rack={currentRack}
          existingFiles={[]}
          zIndex={300}
        />
      )}
      <ModalRoot {...props} onClose={onClose} fullScreen>
        <ModalOverlay backgroundOpacity={0.55} blur={3} />
        <ModalContent>
          <ModalHeader bg="gray.2" ref={ref}>
            <DrawingToolBox
              canvasRef={canvasRef}
              onClear={onClear}
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
              backgroundImage={backgroundImage}
            >
              {moreInfos.map((mI, i) => (
                <IconInfoCircleFilled
                  key={i}
                  style={{ position: "absolute", left: mI.x, top: mI.y }}
                  onClick={() => handleMoreInfoOpen(i)}
                />
              ))}

              {racks.map((r, i) => (
                <IconServer2
                  key={i}
                  style={{ position: "absolute", left: r.x, top: r.y }}
                  onClick={() => handleRackOpen(i)}
                />
              ))}
            </Drawing>
          </ModalBody>
        </ModalContent>
      </ModalRoot>
    </>
  );
}
