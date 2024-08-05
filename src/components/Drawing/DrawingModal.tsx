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
import MoreInfoModal, {
  MoreInfoFormValues,
} from "./CustomTools/MoreInfo/MoreInfoModal";
import { IconInfoCircleFilled, IconServer2 } from "@tabler/icons-react";
import RackModal, { RackFormValues } from "./CustomTools/Rack/RackModal";
import { createFormActions } from "@mantine/form";
import { Hardware, MoreInfo, Rack, Room } from "../../../internal";

const rackFormActions = createFormActions<RackFormValues>("rack-form");
const moreInfoFormActions =
  createFormActions<MoreInfoFormValues>("more-info-form");

export type CustomTools =
  | {
      isRoom: true;
      racks?: Rack[];
      moreInfos?: MoreInfo[];
      room: Room;
      onSaveRack: (rack: Rack) => void;
      onSaveMoreInfo: (moreInfo: MoreInfo) => void;
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
      ) => MoreInfo.add({ roomId: room?.id, x: x - 12, y: y - 12 }),
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
      ) => Rack.add({ roomId: room?.id, x: x - 12, y: y - 12 }),
    },
  ];
  const tools = isRoom
    ? [...defaultTools, ...customTools]
    : isSignature
      ? defaultTools.filter((v) => v.value === "freeHand")
      : defaultTools;

  const handleMoreInfoOpen = (moreInfo: MoreInfo) => {
    moreInfoFormActions.setFieldValue("moreInfo", moreInfo);
    moreInfoOpen();
  };
  const handleRackOpen = async (rack: Rack) => {
    rackFormActions.setFieldValue("rack", rack);
    rackFormActions.setFieldValue(
      "hardwareList",
      await Hardware.getByRack(rack),
    );
    rackOpen();
  };
  const handleSaveMoreInfo = (moreInfo: MoreInfo) => {
    moreInfoClose();
    moreInfo.flag = moreInfo.flag === "i" ? "i" : "u";
    onSaveMoreInfo?.(moreInfo);
  };
  const handleSaveRack = (rack: Rack) => {
    rackClose();
    rack.flag = rack.flag === "i" ? "i" : "u";
    onSaveRack?.(rack);
  };
  const handleSaveHardware = (hardwareList: Hardware[]) => {
    Hardware.updateHardwareList(hardwareList);
  };

  return (
    <>
      <MoreInfoModal
        onClose={moreInfoClose}
        onSave={handleSaveMoreInfo}
        opened={moreInfoModalOpened}
        existingFiles={[]}
        zIndex={300}
      />
      <RackModal
        onClose={rackClose}
        onSave={handleSaveRack}
        onSaveHardware={handleSaveHardware}
        opened={rackModalOpened}
        existingFiles={[]}
        zIndex={300}
      />

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
                  onClick={() => handleMoreInfoOpen(mI)}
                />
              ))}

              {racks.map((r, i) => (
                <IconServer2
                  key={i}
                  style={{ position: "absolute", left: r.x, top: r.y }}
                  onClick={() => handleRackOpen(r)}
                />
              ))}
            </Drawing>
          </ModalBody>
        </ModalContent>
      </ModalRoot>
    </>
  );
}
