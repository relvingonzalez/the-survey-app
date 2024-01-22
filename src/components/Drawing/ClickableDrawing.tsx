import { useGalleryFile } from "@/lib/hooks/useGaleryFiles";
import { Image, Center } from "@mantine/core";
import DrawingModal, {
  CustomTools,
  DrawingModalProps,
} from "../Drawing/DrawingModal";
import { useDisclosure } from "@mantine/hooks";

type ClickableDrawingBaseProps = {
  onSaveDrawing: (file: File) => void;
  file?: File;
  fallbackSrc?: string;
};

export type ClickableDrawingProps = Pick<DrawingModalProps, "isSignature"> &
  CustomTools &
  ClickableDrawingBaseProps;
export default function ClickableDrawing({
  fallbackSrc = "/600x400.svg",
  file,
  onSaveDrawing,
  ...drawingModalProps
}: ClickableDrawingProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const galleryFile = useGalleryFile(file);
  const handleSavePlan = (files: File[]) => onSaveDrawing(files[0]);

  return (
    <Center>
      <DrawingModal
        backgroundImage={galleryFile}
        opened={opened}
        onClose={close}
        onSave={handleSavePlan}
        {...drawingModalProps}
      />
      <Image
        style={(theme) => ({ boxShadow: theme.shadows.lg })}
        onClick={open}
        alt="Room plan"
        radius="md"
        src={galleryFile?.url}
        mah={400}
        maw={600}
        fallbackSrc={fallbackSrc}
      />
    </Center>
  );
}
