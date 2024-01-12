import {
  useEventListener,
  useMergedRef,
  useMouse,
  useWindowEvent,
} from "@mantine/hooks";
import classes from "./Drawing.module.css";
import { CanvasHTMLAttributes, useCallback, useEffect, useState } from "react";

// active button, on click check x and y start points and end points

// Toolbar

export type DrawingStateProps = {
  selectedColor: string;
  activeTool: string;
};

export type DrawingProps = CanvasHTMLAttributes<HTMLCanvasElement> &
  DrawingStateProps;

function drawRect(
  selectedColor: string,
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.fillStyle = selectedColor;
  ctx.clearRect(startX, startY, endX - startX, endY - startY);
  ctx.strokeRect(startX, startY, endX - startX, endY - startY);
}

function finishRect(
  selectedColor: string,
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) {
  ctx.fillStyle = selectedColor;
  ctx.closePath();
  ctx.strokeRect(startX, startY, endX - startX, endY - startY);
}

function drawFreehand(
  selectedColor: string,
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  x: number,
  y: number,
) {
  ctx.beginPath(); // begin

  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = selectedColor;

  ctx.moveTo(startX, startY); // from
  ctx.lineTo(x, y); // to
  ctx.stroke(); // draw it!
}

function drawLine(
  selectedColor: string,
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  x: number,
  y: number,
) {
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = selectedColor;

  ctx.moveTo(startX, startY); // from
  ctx.lineTo(x, y); // t
  //ctx.stroke();
  ctx.closePath();
}

const initialCoords = { x: 0, y: 0 };
export default function Drawing({
  width,
  height,
  activeTool,
  selectedColor,
  ...props
}: DrawingProps) {
  const { ref: canvasRef, x, y } = useMouse();
  const [mouseCoords, setMouseCoords] = useState({ ...initialCoords });
  const [mouseDownFlag, setMouseDownFlag] = useState(false);
  const ctx = canvasRef.current.getContext("2d");

  const mouseDownHandler = () => {
    ctx.beginPath();
    setMouseCoords({ x: x, y: y });
    setMouseDownFlag(true);
  };

  const mouseMoveHandler = () => {
    setMouseCoords({ x: x, y: y });

    if (mouseDownFlag) {
      if (activeTool === "rectangle") {
        drawRect(selectedColor, ctx, mouseCoords.x, mouseCoords.y, x, y);
      } else if (activeTool === "freeHand") {
        drawFreehand(selectedColor, ctx, mouseCoords.x, mouseCoords.y, x, y);
      } else if (activeTool === "line") {
        drawLine(selectedColor, ctx, mouseCoords.x, mouseCoords.y, x, y);
      }
    }
  };

  const mouseUpHandler = () => {
    if (activeTool === "rectangle") {
      finishRect(selectedColor, ctx, mouseCoords.x, mouseCoords.y, x, y);
    }
    ctx.closePath(); // draw it!

    setMouseCoords({ ...initialCoords });
    setMouseDownFlag(false);
  };

  const mouseDownRef = useEventListener("mousedown", mouseDownHandler);
  const mouseMoveRef = useEventListener("mousemove", mouseMoveHandler);
  const mouseUpRef = useEventListener("mouseup", mouseUpHandler);

  // Merge refs
  const mergedRef = useMergedRef(
    canvasRef,
    mouseDownRef,
    mouseMoveRef,
    mouseUpRef,
  );

  // Resize
  const handleResize = useCallback(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.canvas.height = height;
    ctx.canvas.width = width;
  }, [canvasRef, height, width]);

  useEffect(() => {
    handleResize();
  }, [handleResize]);

  //watch mouse click
  // on click check which tool used, and decide which function to run
  // First clicks sets off useMouseMove ?
  // second click draws shape, saves it to history

  useWindowEvent("resize", handleResize);
  //console.log(x, y);
  return <canvas ref={mergedRef} className={classes.drawing} {...props} />;
}
