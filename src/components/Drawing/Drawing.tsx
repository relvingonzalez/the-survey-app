import {
  useEventListener,
  useMergedRef,
  useMouse,
  useWindowEvent,
} from "@mantine/hooks";
import classes from "./Drawing.module.css";
import {
  CanvasHTMLAttributes,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Box } from "@mantine/core";
import { clearCanvas, drawCanvas, prepareCanvas } from "./DrawingFunctions";
import { DrawingToolBoxTools, Tool, defaultTools } from "./DrawingToolBox";
import { GalleryFile } from "@/lib/hooks/useGaleryFiles";

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
  const { ref: tempRef, x: x, y: y } = useMouse();
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
        const ctxTemp = tempRef.current.getContext("2d");
        ctxTemp.drawImage(img, 0, 0);
      };
      img.src = backgroundImage.url;
    }
  }, [backgroundImage, tempRef]);

  const mouseDownHandler = () => {
    if (tool && !mouseDownFlag) {
      const ctxTemp = tempRef.current.getContext("2d");
      setMouseCoords({ x: x, y: y });
      setMouseDownFlag(true);
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
  };

  const mouseMoveHandler = () => {
    if (tool && mouseDownFlag) {
      const ctxTemp = tempRef.current.getContext("2d");
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
    if (tool && mouseDownFlag) {
      const ctx = canvasRef?.current?.getContext("2d");
      const ctxTemp = tempRef.current.getContext("2d");

      tool.onMouseUp?.(
        selectedColor,
        ctxTemp,
        mouseCoords.x,
        mouseCoords.y,
        x,
        y,
      );

      if (!ctx) {
        return;
      }

      drawCanvas(ctx, ctxTemp);
      setMouseCoords({ ...initialCoords });
      setMouseDownFlag(false);
      clearCanvas(
        ctxTemp,
        tempRef.current.clientWidth,
        tempRef.current.clientHeight,
      );
    }
  };

  const mouseDownRef = useEventListener("mousedown", mouseDownHandler);
  const mouseMoveRef = useEventListener("mousemove", mouseMoveHandler);
  const mouseUpRef = useEventListener("mouseup", mouseUpHandler);

  const touchStartHandler = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    tempRef.current.dispatchEvent(mouseEvent);
  };

  const touchMoveHandler = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    tempRef.current.dispatchEvent(mouseEvent);
  };

  const touchEndHandler = (e: TouchEvent) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent("mouseup", {
      clientX: e.changedTouches[0].clientX - mouseCoords.x,
      clientY: e.changedTouches[0].clientY - mouseCoords.y,
    });
    tempRef.current.dispatchEvent(mouseEvent);
  };

  const touchStartRef = useEventListener("touchstart", touchStartHandler);
  const touchMoveRef = useEventListener("touchmove", touchMoveHandler);
  const touchEndRef = useEventListener("touchend", touchEndHandler);

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
