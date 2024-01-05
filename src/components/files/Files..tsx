import { SimpleGrid, Image, Box, BoxProps, ActionIcon } from "@mantine/core";
import { FileButton, Group, Text } from "@mantine/core";
import { IconPencil, IconPhoto } from "@tabler/icons-react";

const acceptTypes =
  ".doc,.docx,.zip,.pdf,.xls,.xlsx,.ppt,.pptx,.mp3,.wav,.tgz,image/*";

type GalleryProps = {
  files: File[];
  onDelete: (file: File) => void;
};

export function Gallery({ files }: GalleryProps) {
  return (
    <SimpleGrid cols={4}>
      {files.map((f, i) => (
        <Image key={i} src={f} radius="md" h="auto" w={200} fit="contain" />
      ))}
    </SimpleGrid>
  );
}

export type FilesProps = GalleryProps &
  BoxProps & {
    onSelectFiles: (files: File[]) => void;
    hideFileButton?: boolean;
    hideDrawingButton?: boolean;
  };
export default function Files({
  files,
  hideFileButton,
  hideDrawingButton,
  onDelete,
  onSelectFiles,
  ...boxProps
}: FilesProps) {
  return (
    // add hook const galleryFiles = useGalleryFiles(files);
    <Box {...boxProps}>
      <Group justify="center">
        {!hideFileButton && (
          <FileButton onChange={onSelectFiles} accept={acceptTypes} multiple>
            {(props) => (
              <ActionIcon
                {...props}
                size={42}
                variant="default"
                aria-label="Pictures and Files"
                px="4"
              >
                <IconPhoto />
              </ActionIcon>
            )}
          </FileButton>
        )}
        {!hideDrawingButton && (
          <ActionIcon
            size={42}
            variant="default"
            aria-label="Drawing Board"
            px="4"
          >
            <IconPencil />
          </ActionIcon>
        )}
      </Group>

      {files.length > 0 && (
        <Text size="sm" mt="sm">
          Selected files:
        </Text>
      )}

      <Gallery files={files} onDelete={onDelete} />
    </Box>
  );
}
