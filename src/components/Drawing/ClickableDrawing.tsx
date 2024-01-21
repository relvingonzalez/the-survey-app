import { useGalleryFile } from "@/lib/hooks/useGaleryFiles";
import { Image, Center, CenterProps } from "@mantine/core";
import DrawingModal from "../Drawing/DrawingModal";
import { useDisclosure } from "@mantine/hooks";

export type ClickableDrawingProps = CenterProps & {
  isSignature?: boolean;
  onSaveDrawing: (file: File) => void;
  file?: File;
  fallbackSrc?: string;
};
export default function ClickableDrawing({
  fallbackSrc = "/600x400.svg",
  file,
  isSignature,
  onSaveDrawing,
  ...centerProps
}: ClickableDrawingProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const galleryFile = useGalleryFile(file);
  const handleSavePlan = (files: File[]) => onSaveDrawing(files[0]);

  return (
    <Center {...centerProps}>
      <DrawingModal
        backgroundImage={galleryFile}
        opened={opened}
        onClose={close}
        onSave={handleSavePlan}
        isSignature={isSignature}
      />
      <Image
        style={(theme) => ({ boxShadow: theme.shadows.lg })}
        onClick={open}
        alt="Room plan"
        radius="md"
        src={galleryFile?.url}
        h={400}
        w={600}
        fallbackSrc={fallbackSrc}
      />
    </Center>
  );
}
