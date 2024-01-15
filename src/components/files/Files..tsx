import useGalleryFiles, { GalleryFile } from "@/lib/hooks/useGaleryFiles";
import { SimpleGrid, Image, Box, BoxProps, ActionIcon } from "@mantine/core";
import { FileButton, Group, Text } from "@mantine/core";
import { IconPhoto, IconWriting } from "@tabler/icons-react";
import DrawingModal from "../Drawing/DrawingModal";
import { useDisclosure } from "@mantine/hooks";

const acceptTypes =
  ".doc,.docx,.zip,.pdf,.xls,.xlsx,.ppt,.pptx,.mp3,.wav,.tgz,image/*";

export type FileCallbacks = {
  onDeleteFile: (i: number) => void;
  onSelectFiles: (files: File[]) => void;
};

export type GalleryProps = Pick<FileCallbacks, "onDeleteFile"> & {
  files: GalleryFile[];
};
export function Gallery({ files }: GalleryProps) {
  return (
    <SimpleGrid cols={6}>
      {files.map((f, i) => {
        return (
          <Image
            alt={f.name}
            key={i}
            src={f.url}
            radius="md"
            h={150}
            w="auto"
            maw={200}
            fit="contain"
            onLoad={f.url ? () => URL.revokeObjectURL(f.url) : () => {}}
            style={{ border: "1px black solid" }}
          />
        );
      })}
    </SimpleGrid>
  );
}

export type FilesProps = BoxProps &
  FileCallbacks & {
    files: File[];
    hideFileButton?: boolean;
    hideDrawingButton?: boolean;
  };
export default function Files({
  files,
  hideFileButton,
  hideDrawingButton,
  onDeleteFile,
  onSelectFiles,
  ...boxProps
}: FilesProps) {
  const galleryFiles = useGalleryFiles(files);
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Box {...boxProps}>
      {!hideDrawingButton && (
        <DrawingModal opened={opened} onClose={close} onSave={onSelectFiles} />
      )}
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
            onClick={open}
            size={42}
            variant="default"
            aria-label="Drawing Board"
            px="4"
          >
            <IconWriting />
          </ActionIcon>
        )}
      </Group>

      {files.length > 0 && (
        <Text size="sm" my="sm">
          Attachments:
        </Text>
      )}

      <Gallery files={galleryFiles} onDeleteFile={onDeleteFile} />
    </Box>
  );
}
