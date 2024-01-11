import { useMouse } from "@mantine/hooks";
import classes from "./Drawing.module.css";
import { CanvasHTMLAttributes } from "react";

// active button, on click check x and y start points and end points

// Toolbar

export type DrawingProps = CanvasHTMLAttributes<HTMLCanvasElement>;

export default function Drawing({ ...props }: DrawingProps) {
  const { ref, x, y } = useMouse();
  console.log(x, y);
  return <canvas ref={ref} className={classes.drawing} {...props} />;
}
