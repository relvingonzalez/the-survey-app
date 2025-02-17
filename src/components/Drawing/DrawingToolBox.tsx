import {
  ColorPicker,
  Group,
  ActionIconGroup,
  ActionIcon,
  rem,
  Popover,
  PopoverTarget,
  PopoverDropdown,
  Button,
  Tooltip,
  ColorSwatch,
} from "@mantine/core";
import {
  Icon,
  IconCircle,
  IconEaseInOut,
  IconLine,
  IconRectangle,
} from "@tabler/icons-react";
import { DrawingCanvasRef, DrawingStateProps } from "./Drawing";
import {
  clearCanvasToOriginal,
  drawCircle,
  drawLine,
  drawRect,
} from "./DrawingFunctions";
import { useState } from "react";

export type ToolFn = (
  selectedColor: string,
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  x: number,
  y: number,
) => void;

export type Tool = {
  label: string;
  value: string;
  icon: Icon;
  skipClearOnMove?: boolean;
  setCoordsOnMove?: boolean;
  onMouseDown?: ToolFn;
  onMouseUp?: ToolFn;
  onMouseMove?: ToolFn;
};

export const defaultTools: Tool[] = [
  { label: "Line", value: "line", icon: IconLine, onMouseMove: drawLine },
  {
    label: "Circle",
    value: "circle",
    icon: IconCircle,
    onMouseMove: drawCircle,
  },
  {
    label: "Rectangle",
    value: "rectangle",
    icon: IconRectangle,
    onMouseMove: drawRect,
  },
  {
    label: "Freehand",
    value: "freeHand",
    icon: IconEaseInOut,
    skipClearOnMove: true,
    setCoordsOnMove: true,
    onMouseMove: drawLine,
  },
];

export const createToolsObject = (tools: Tool[]) =>
  tools.reduce((a, v) => ({ ...a, [v.value]: v }), {});

const swatches = [
  "#ffffff",
  "#2e2e2e",
  "#868e96",
  "#fa5252",
  "#e64980",
  "#7950f2",
  "#4c6ef5",
  "#228be6",
  "#15aabf",
  "#12b886",
  "#40c057",
  "#82c91e",
  "#fab005",
  "#fd7e14",
];

export type DrawingToolBoxCallbacks = {
  onClear?: () => void;
  onClose?: () => void;
  onSave?: (files: File[]) => void;
  onSelectColor: (color: string) => void;
  onSelectTool: (tool: string) => void;
};

export type DrawingToolBoxTools = {
  tools?: Tool[];
};

export type DrawingToolBoxProps = DrawingToolBoxCallbacks &
  DrawingStateProps &
  DrawingCanvasRef &
  DrawingToolBoxTools;

export default function DrawingToolBox({
  selectedColor = "#2e2e2e",
  activeTool,
  canvasRef,
  tools = defaultTools,
  onClear,
  onClose,
  onSave,
  onSelectColor,
  onSelectTool,
}: DrawingToolBoxProps) {
  const [colorPickerOpened, setColorPickerOpened] = useState(false);

  const handleSave = () => {
    canvasRef?.current?.getContext("2d")?.canvas.toBlob((blob) => {
      blob &&
        onSave?.([new File([blob], "NewDrawing.jpg", { type: "image/jpeg" })]);
      onClose?.();
    }, "image/jpeg");
  };
  const handleClear = () => {
    const ctx = canvasRef?.current?.getContext("2d");
    if (ctx) {
      clearCanvasToOriginal(
        ctx,
        canvasRef.current?.clientWidth || 0,
        canvasRef.current?.clientHeight || 0,
      );
    }
    onClear?.();
  };

  return (
    <Group w="100%" justify="space-around">
      <Group>
        <Popover
          opened={colorPickerOpened}
          width={300}
          position="bottom"
          withArrow
          shadow="md"
        >
          <PopoverTarget>
            <Tooltip label="Select Color">
              <ActionIcon
                variant="outline"
                color="white"
                size="xl"
                aria-label="Gallery"
                onClick={() => setColorPickerOpened(!colorPickerOpened)}
              >
                <ColorSwatch
                  color={selectedColor}
                  style={{ width: rem(20) }}
                  radius="xs"
                />
              </ActionIcon>
            </Tooltip>
          </PopoverTarget>
          <PopoverDropdown p="sm">
            <ColorPicker
              value={selectedColor}
              onChange={onSelectColor}
              w="100%"
              format="hex"
              swatches={swatches}
              onColorSwatchClick={() => setColorPickerOpened(false)}
            />
          </PopoverDropdown>
        </Popover>
        <ActionIconGroup>
          {tools.map((t, i) => (
            <Tooltip key={i} label={t.label}>
              <ActionIcon
                variant={activeTool === t.value ? "filled" : "default"}
                size="xl"
                aria-label={t.label}
                onClick={() => onSelectTool(t.value)}
              >
                <t.icon style={{ width: rem(20) }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          ))}
        </ActionIconGroup>
      </Group>
      <Button variant="danger" onClick={handleClear}>
        Clear Canvas
      </Button>
      <Group>
        <Button ml="xl" onClick={onClose} variant="warning">
          Close
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </Group>
    </Group>
  );
}
