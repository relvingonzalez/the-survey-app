import {
  useDisclosure,
  useEventListener,
  useListState,
  useMergedRef,
  useMouse,
  useWindowEvent,
} from "@mantine/hooks";
import classes from "./Drawing.module.css";
import {
  CanvasHTMLAttributes,
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Box } from "@mantine/core";
import { clearCanvas, drawCanvas, prepareCanvas } from "./DrawingFunctions";
import { toolsObject } from "./DrawingToolBox";
import { MoreInfo, Rack } from "@/lib/types/rooms";
import MoreInfoModal from "./CustomTools/MoreInfo/MoreInfoModal";

export type CustomTools = {
  racks: Rack[];
  moreInfo: MoreInfo[];
};

export type DrawingCanvasRef = {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
};

export type DrawingStateProps = {
  selectedColor: string;
  activeTool: string;
};

export type DrawingSizeProps = {
  height: number;
  width: number;
};

export type DrawingProps = CanvasHTMLAttributes<HTMLCanvasElement> &
  DrawingStateProps &
  DrawingCanvasRef &
  DrawingSizeProps &
  CustomTools;

const initialCoords = { x: 0, y: 0 };
export default function Drawing({
  width,
  height,
  activeTool,
  selectedColor,
  canvasRef,
  racks = [],
  moreInfo = [],
  ...props
}: DrawingProps) {
  const { ref: tempRef, x: x, y: y } = useMouse();
  const [mouseCoords, setMouseCoords] = useState({ ...initialCoords });
  const [mouseDownFlag, setMouseDownFlag] = useState(false);
  const tool = toolsObject[activeTool];

  // this needs to get moved up
  // Include modal, replace
  const [opened, { open }] = useDisclosure(false);
  const [localRacks, handlersRack] = useListState<Rack>(racks);
  const [localMoreInfo, handlersMoreInfo] = useListState<MoreInfo>(moreInfo);

  const mouseDownHandler = () => {
    const ctxTemp = tempRef.current.getContext("2d");
    setMouseCoords({ x: x, y: y });
    setMouseDownFlag(true);
    clearCanvas(
      ctxTemp,
      tempRef.current.clientWidth,
      tempRef.current.clientHeight,
    );

    // run mouse down from tool
  };

  const mouseMoveHandler = () => {
    const ctxTemp = tempRef.current.getContext("2d");

    if (tool && mouseDownFlag) {
      !tool.skipClearOnMove &&
        clearCanvas(
          ctxTemp,
          tempRef.current.clientWidth,
          tempRef.current.clientHeight,
        );
      tool.setCoordsOnMove && setMouseCoords({ x: x, y: y });
      tool.onMouseMove?.(
        selectedColor,
        ctxTemp,
        mouseCoords.x,
        mouseCoords.y,
        x,
        y,
      );
    }
  };

  const mouseUpHandler = () => {
    const ctx = canvasRef?.current?.getContext("2d");
    const ctxTemp = tempRef.current.getContext("2d");

    // TODO make this better
    if (tool.value === "moreInfo") {
      handlersMoreInfo.append({ info: "", x, y });
    }

    if (tool.value === "rack") {
      handlersRack.append({ rackName: "", rackList: [], x, y });
    }

    // if active tool has mouseUp, run mouse up.
    // With custom tools, that means placing the image on screen and running the function
    // We have x, y coordinates, and we have the function.
    // For MoreInfo and Racks, we should place the tool image on where the mouse clicked and open the tool modal

    if (!ctx) {
      return;
    }

    setMouseCoords({ ...initialCoords });
    setMouseDownFlag(false);
    drawCanvas(
      ctx,
      tempRef.current,
      ctxTemp,
      tempRef.current.width,
      tempRef.current.height,
    );
  };

  const mouseDownRef = useEventListener("mousedown", mouseDownHandler);
  const mouseMoveRef = useEventListener("mousemove", mouseMoveHandler);
  const mouseUpRef = useEventListener("mouseup", mouseUpHandler);

  // Merge refs
  const mergedRef = useMergedRef(
    tempRef,
    mouseDownRef,
    mouseMoveRef,
    mouseUpRef,
  );

  // Resize
  const handleResize = useCallback(() => {
    const ctx = canvasRef?.current?.getContext("2d");

    if (ctx?.canvas) {
      ctx.canvas.height = height;
      ctx.canvas.width = width;
      prepareCanvas(ctx, width, height);
    }

    const ctxTemp = tempRef.current.getContext("2d");
    ctxTemp.canvas.height = height;
    ctxTemp.canvas.width = width;
    prepareCanvas(ctxTemp, width, height);
  }, [canvasRef, height, tempRef, width]);

  useEffect(() => {
    handleResize();
  }, [handleResize]);

  useWindowEvent("resize", handleResize);
  return (
    <Box pos="relative">
      {localMoreInfo[0] && (
        <MoreInfoModal
          onClose={() => {}}
          onSave={() => {}}
          opened={opened}
          moreInfo={localMoreInfo[0]}
          existingFiles={[]}
        />
      )}
      <canvas ref={canvasRef} className={classes.drawing} {...props} />
      <canvas
        id="tempCanvas"
        ref={mergedRef}
        className={classes.drawingTemp}
        {...props}
      />
      {localMoreInfo.map((mI, i) => (
        <toolsObject.moreInfo.icon
          key={i}
          style={{ position: "absolute", left: mI.x, top: mI.y }}
          onClick={open}
        />
      ))}

      {localRacks.map((r, i) => (
        <toolsObject.rack.icon
          key={i}
          style={{ position: "absolute", left: r.x, top: r.y }}
        />
      ))}
    </Box>
  );
}
