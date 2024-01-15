import {
  useEventListener,
  useMergedRef,
  useMouse,
  useWindowEvent,
} from "@mantine/hooks";
import classes from "./Drawing.module.css";
import { CanvasHTMLAttributes, useCallback, useEffect, useState } from "react";
import { Box } from "@mantine/core";
import {
  clearCanvas,
  drawCanvas,
  drawCircle,
  drawLine,
  drawRect,
} from "./DrawingFunctions";

export type DrawingStateProps = {
  selectedColor: string;
  activeTool: string;
};

export type DrawingProps = CanvasHTMLAttributes<HTMLCanvasElement> &
  DrawingStateProps;

const initialCoords = { x: 0, y: 0 };
export default function Drawing({
  width,
  height,
  activeTool,
  selectedColor,
  ...props
}: DrawingProps) {
  const { ref: canvasRef } = useMouse();
  const { ref: tempRef, x: x, y: y } = useMouse();
  const [mouseCoords, setMouseCoords] = useState({ ...initialCoords });
  const [mouseDownFlag, setMouseDownFlag] = useState(false);

  const mouseDownHandler = () => {
    const ctxTemp = tempRef.current.getContext("2d");
    setMouseCoords({ x: x, y: y });
    setMouseDownFlag(true);
    clearCanvas(
      ctxTemp,
      tempRef.current.clientWidth,
      tempRef.current.clientHeight,
    );
  };

  const mouseMoveHandler = () => {
    const ctxTemp = tempRef.current.getContext("2d");

    if (mouseDownFlag) {
      if (activeTool !== "freeHand") {
        clearCanvas(
          ctxTemp,
          tempRef.current.clientWidth,
          tempRef.current.clientHeight,
        );
      }

      if (activeTool === "rectangle") {
        drawRect(selectedColor, ctxTemp, mouseCoords.x, mouseCoords.y, x, y);
      } else if (activeTool === "freeHand") {
        setMouseCoords({ x: x, y: y });
        drawLine(selectedColor, ctxTemp, mouseCoords.x, mouseCoords.y, x, y);
      } else if (activeTool === "line") {
        drawLine(selectedColor, ctxTemp, mouseCoords.x, mouseCoords.y, x, y);
      } else if (activeTool === "circle") {
        drawCircle(selectedColor, ctxTemp, mouseCoords.x, mouseCoords.y, x, y);
      }
    }
  };

  const mouseUpHandler = () => {
    const ctx = canvasRef.current.getContext("2d");
    const ctxTemp = tempRef.current.getContext("2d");

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
    const ctx = canvasRef.current.getContext("2d");
    ctx.canvas.height = height;
    ctx.canvas.width = width;

    const ctxTemp = tempRef.current.getContext("2d");
    ctxTemp.canvas.height = height;
    ctxTemp.canvas.width = width;
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
    </Box>
  );
}
