import { useEventListener, useMergedRef, useWindowEvent } from "@mantine/hooks";
import classes from "./Drawing.module.css";
import {
  CanvasHTMLAttributes,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box } from "@mantine/core";
import { clearCanvas, drawCanvas, prepareCanvas } from "./DrawingFunctions";
import { DrawingToolBoxTools, Tool, defaultTools } from "./DrawingToolBox";
import { GalleryFile } from "@/lib/hooks/useGaleryFiles";
import { getMousePosition, getTouchPosition } from "@/lib/utils/functions";

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

export type BackgroundImage = {
  backgroundImage?: GalleryFile;
};

export type DrawingProps = PropsWithChildren<
  CanvasHTMLAttributes<HTMLCanvasElement> &
    DrawingStateProps &
    DrawingCanvasRef &
    DrawingToolBoxTools &
    DrawingSizeProps &
    BackgroundImage
>;

const initialCoords = { x: 0, y: 0 };
export default function Drawing({
  width,
  height,
  activeTool,
  selectedColor,
  canvasRef,
  tools = defaultTools,
  backgroundImage,
  children,
  ...props
}: DrawingProps) {
  const tempRef = useRef<HTMLCanvasElement>(null);
  const [mouseCoords, setMouseCoords] = useState({ ...initialCoords });
  const [mouseDownFlag, setMouseDownFlag] = useState(false);
  const [tool, setTool] = useState<Tool>();

  useEffect(() => {
    activeTool && setTool(tools.find((t) => t.value === activeTool));
  }, [activeTool, tools]);

  // This needs to run every time.
  useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.onload = function () {
        // execute drawImage statements here
        const ctxTemp = tempRef.current?.getContext("2d");
        ctxTemp?.drawImage(img, 0, 0);
      };
      img.src = backgroundImage.url;
    }
  }, [backgroundImage, tempRef]);

  const handleDown = useCallback(
    (x: number, y: number) => {
      if (tool && !mouseDownFlag && tempRef.current) {
        const ctxTemp = tempRef.current.getContext("2d");
        setMouseCoords({ x: x, y: y });
        setMouseDownFlag(true);
        if (!ctxTemp) {
          return;
        }

        clearCanvas(
          ctxTemp,
          tempRef.current.clientWidth,
          tempRef.current.clientHeight,
        );
        tool.onMouseDown?.(
          selectedColor,
          ctxTemp,
          mouseCoords.x,
          mouseCoords.y,
          x,
          y,
        );
      }
    },
    [mouseCoords.x, mouseCoords.y, mouseDownFlag, selectedColor, tool],
  );

  const handleMove = useCallback(
    (x: number, y: number) => {
      if (tool && mouseDownFlag && tempRef.current) {
        const ctxTemp = tempRef.current.getContext("2d");
        if (!ctxTemp) {
          return;
        }

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
    },
    [mouseCoords.x, mouseCoords.y, mouseDownFlag, selectedColor, tool],
  );

  const handleUp = useCallback(
    (x: number, y: number) => {
      if (tool && mouseDownFlag && tempRef.current) {
        const ctx = canvasRef?.current?.getContext("2d");
        const ctxTemp = tempRef.current.getContext("2d");
        if (!ctxTemp) {
          return;
        }
        tool.onMouseUp?.(
          selectedColor,
          ctxTemp,
          mouseCoords.x,
          mouseCoords.y,
          x,
          y,
        );

        if (ctx) {
          drawCanvas(ctx, ctxTemp);
          setMouseCoords({ x: x, y: y });
          setMouseDownFlag(false);
          clearCanvas(
            ctxTemp,
            tempRef.current.clientWidth,
            tempRef.current.clientHeight,
          );
        }
      }
    },
    [
      canvasRef,
      mouseCoords.x,
      mouseCoords.y,
      mouseDownFlag,
      selectedColor,
      tool,
    ],
  );

  const mouseDownHandler = useCallback(
    (e: MouseEvent) => {
      const { x, y } = getMousePosition(tempRef, e);
      handleDown(x, y);
    },
    [handleDown],
  );

  const mouseMoveHandler = useCallback(
    (e: MouseEvent) => {
      const { x, y } = getMousePosition(tempRef, e);
      handleMove(x, y);
    },
    [handleMove],
  );

  const mouseUpHandler = useCallback(
    (e: MouseEvent) => {
      const { x, y } = getMousePosition(tempRef, e);
      handleUp(x, y);
    },
    [handleUp],
  );

  const touchStartHandler = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const { x, y } = getTouchPosition(tempRef, e);
      handleDown(x, y);
    },
    [handleDown],
  );

  const touchMoveHandler = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const { x, y } = getTouchPosition(tempRef, e);
      handleMove(x, y);
    },
    [handleMove],
  );

  const touchEndHandler = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const { x, y } = getTouchPosition(tempRef, e);
      handleUp(x, y);
    },
    [handleUp],
  );

  const mouseDownRef = useEventListener("mousedown", mouseDownHandler);
  const mouseMoveRef = useEventListener("mousemove", mouseMoveHandler);
  const mouseUpRef = useEventListener("mouseup", mouseUpHandler);

  const touchStartRef = useEventListener("touchstart", touchStartHandler, {
    passive: false,
  });
  const touchMoveRef = useEventListener("touchmove", touchMoveHandler, {
    passive: false,
  });
  const touchEndRef = useEventListener("touchend", touchEndHandler, {
    passive: false,
  });

  // Merge refs
  const mergedRef = useMergedRef(
    tempRef,
    mouseDownRef,
    mouseMoveRef,
    mouseUpRef,
    touchStartRef,
    touchMoveRef,
    touchEndRef,
  );

  // Resize
  const handleResize = useCallback(() => {
    const ctx = canvasRef?.current?.getContext("2d");
    if (!ctx) {
      return;
    }

    if (ctx?.canvas) {
      ctx.canvas.height = height;
      ctx.canvas.width = width;
      prepareCanvas(ctx, width, height);
    }

    const ctxTemp = tempRef.current?.getContext("2d");
    if (!ctxTemp) {
      return;
    }
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
      <canvas ref={canvasRef} className={classes.drawing} {...props} />
      <canvas
        id="tempCanvas"
        ref={mergedRef}
        className={classes.drawingTemp}
        {...props}
      />
      {children}
    </Box>
  );
}
