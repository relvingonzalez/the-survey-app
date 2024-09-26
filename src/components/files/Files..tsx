import useGalleryFiles, { GalleryFile } from "@/lib/hooks/useGaleryFiles";
import { Image, Box, BoxProps, ActionIcon, Flex } from "@mantine/core";
import { FileButton, Group, Text } from "@mantine/core";
import { IconPhoto, IconTrash, IconWriting } from "@tabler/icons-react";
import DrawingModal from "../Drawing/DrawingModal";
import { useDisclosure } from "@mantine/hooks";
import { SurveyFile } from "../../../internal";

const acceptTypes =
  ".doc,.docx,.zip,.pdf,.xls,.xlsx,.ppt,.pptx,.mp3,.wav,.tgz,image/*";

export type FileCallbacks = {
  onDeleteFile: (i: number) => void;
  onSelectFiles: (files: File[]) => void;
};

export type GalleryProps = Pick<FileCallbacks, "onDeleteFile"> & {
  files?: GalleryFile[];
};
export function Gallery({ files, onDeleteFile }: GalleryProps) {
  return (
    <Flex gap="lg" rowGap="lg" wrap="wrap">
      {files?.map((f, i) => {
        return (
          <Group
            key={i}
            pos="relative"
            //style={{ border: "1px black solid" }}
            style={(theme) => ({ boxShadow: theme.shadows.sm })}
            w={200}
            justify="center"
          >
            <Image
              alt={f.name}
              src={f.url}
              radius="md"
              h={150}
              w="auto"
              maw={190}
              fit="contain"
              onLoad={f.url ? () => URL.revokeObjectURL(f.url) : () => {}}
            />
            <ActionIcon
              pos="absolute"
              top="-10px"
              left="180px"
              variant="filled"
              color="red"
              onClick={() => onDeleteFile(i)}
            >
              <IconTrash />
            </ActionIcon>
          </Group>
        );
      })}
    </Flex>
  );
}

export type FilesProps = BoxProps &
  FileCallbacks & {
    files?: SurveyFile[];
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
  console.log(files, galleryFiles);

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

      {files && files.length > 0 && (
        <Text size="sm" my="sm">
          Attachments:
        </Text>
      )}

      <Gallery files={galleryFiles} onDeleteFile={onDeleteFile} />
    </Box>
  );
}
