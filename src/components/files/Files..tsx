import useGalleryFiles, { GalleryFile } from "@/lib/hooks/useGaleryFiles";
import { SimpleGrid, Image, Box, BoxProps, ActionIcon } from "@mantine/core";
import { FileButton, Group, Text } from "@mantine/core";
import { IconPencil, IconPhoto } from "@tabler/icons-react";

const acceptTypes =
  ".doc,.docx,.zip,.pdf,.xls,.xlsx,.ppt,.pptx,.mp3,.wav,.tgz,image/*";

export type GalleryProps = {
  files: GalleryFile[];
  onDelete: (i: number) => void;
};
export function Gallery({ files }: GalleryProps) {
  return (
    <SimpleGrid cols={6}>
      {files.map((f, i) => {
        return (
          <Image
            key={i}
            src={f.url}
            radius="md"
            h={150}
            w="auto"
            fit="contain"
            onLoad={f.url ? () => URL.revokeObjectURL(f.url) : () => {}}
          />
        );
      })}
    </SimpleGrid>
  );
}

export type FilesProps = BoxProps & {
  files: File[];
  onDelete: (i: number) => void;
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
  const galleryFiles = useGalleryFiles(files);
  return (
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
        <Text size="sm" my="sm">
          Attachments:
        </Text>
      )}

      <Gallery files={galleryFiles} onDelete={onDelete} />
    </Box>
  );
}
