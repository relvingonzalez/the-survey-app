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
} from "@mantine/core";
import {
  IconCircle,
  IconColorPicker,
  IconEaseInOut,
  IconInfoCircleFilled,
  IconLine,
  IconRectangle,
  IconServer2,
} from "@tabler/icons-react";

export type DrawingToolBoxProps = {
  onClose?: () => void;
  onSave?: () => void;
};

export default function DrawingToolBox({
  onClose,
  onSave,
}: DrawingToolBoxProps) {
  // move this state to the modal
  return (
    <Group>
      <Popover width={300} position="bottom" withArrow shadow="md">
        <PopoverTarget>
          <Tooltip label="Select Color">
            <ActionIcon variant="default" size="xl" aria-label="Gallery">
              <IconColorPicker style={{ width: rem(20) }} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </PopoverTarget>
        <PopoverDropdown p="sm">
          <ColorPicker
            w="100%"
            format="hex"
            swatches={[
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
            ]}
          />
        </PopoverDropdown>
      </Popover>
      <ActionIconGroup>
        <Tooltip label="Line">
          <ActionIcon variant="default" size="xl" aria-label="Line">
            <IconLine style={{ width: rem(20) }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Circle">
          <ActionIcon variant="default" size="xl" aria-label="Circle">
            <IconCircle style={{ width: rem(20) }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Rectangle">
          <ActionIcon variant="default" size="xl" aria-label="Rectangle">
            <IconRectangle style={{ width: rem(20) }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Freehand">
          <ActionIcon variant="default" size="xl" aria-label="Freehand">
            <IconEaseInOut style={{ width: rem(20) }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="More Info">
          <ActionIcon variant="default" size="xl" aria-label="More Info">
            <IconInfoCircleFilled style={{ width: rem(20) }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Rack">
          <ActionIcon variant="default" size="xl" aria-label="Rack">
            <IconServer2 style={{ width: rem(20) }} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      </ActionIconGroup>
      <Button ml="xl" onClick={onClose}>
        Close
      </Button>
      <Button onClick={onSave}>Save</Button>
    </Group>
  );
}
