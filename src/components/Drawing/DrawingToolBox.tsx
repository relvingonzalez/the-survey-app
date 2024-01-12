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
  IconCircle,
  IconEaseInOut,
  IconInfoCircleFilled,
  IconLine,
  IconRectangle,
  IconServer2,
} from "@tabler/icons-react";
import { DrawingStateProps } from "./Drawing";

const tools = [
  { label: "Line", value: "line", icon: IconLine },
  { label: "Circle", value: "circle", icon: IconCircle },
  { label: "Rectangle", value: "rectangle", icon: IconRectangle },
  { label: "Freehand", value: "freeHand", icon: IconEaseInOut },
  { label: "More Info", value: "moreInfo", icon: IconInfoCircleFilled },
  { label: "Rack", value: "rack", icon: IconServer2 },
];

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
  onClose?: () => void;
  onSave?: () => void;
  onSelectColor: (color: string) => void;
  onSelectTool: (tool: string) => void;
};

export type DrawingToolBoxProps = DrawingToolBoxCallbacks & DrawingStateProps;

export default function DrawingToolBox({
  selectedColor = "#2e2e2e",
  activeTool,
  onClose,
  onSave,
  onSelectColor,
  onSelectTool,
}: DrawingToolBoxProps) {
  // move this state to the modal
  return (
    <Group w="100%" justify="space-around">
      <Group>
        <Popover width={300} position="bottom" withArrow shadow="md">
          <PopoverTarget>
            <Tooltip label="Select Color">
              <ActionIcon
                variant="outline"
                color="white"
                size="xl"
                aria-label="Gallery"
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
      <Group>
        <Button ml="xl" onClick={onClose} variant="warning">
          Close
        </Button>
        <Button onClick={onSave}>Save</Button>
      </Group>
    </Group>
  );
}
