import { useGalleryFile } from "@/lib/hooks/useGaleryFiles";
import { Image, Center, CenterProps } from "@mantine/core";
import DrawingModal from "../Drawing/DrawingModal";
import { useDisclosure } from "@mantine/hooks";

export type RoomPlanProps = CenterProps & {
  onSelectRoomPlan: (file: File) => void;
  roomPlan?: File;
};
export default function RoomPlan({
  roomPlan,
  onSelectRoomPlan,
  ...centerProps
}: RoomPlanProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const galleryFile = useGalleryFile(roomPlan);
  const handleSavePlan = (files: File[]) => onSelectRoomPlan(files[0]);

  return (
    <Center {...centerProps}>
      <DrawingModal opened={opened} onClose={close} onSave={handleSavePlan} />
      <Image
        style={(theme) => ({ "box-shadow": theme.shadows.lg })}
        onClick={open}
        alt="Room plan"
        radius="md"
        src={galleryFile?.url}
        h={400}
        w={600}
        fallbackSrc="https://placehold.co/600x400?text=Click+To+Add+Room+Plan"
      />
    </Center>
  );
}
