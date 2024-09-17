import { Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SyncModal } from "../../../internal";
import SyncButton from "../Sync/SyncButton";

export default function NavFooter() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <SyncModal opened={opened} onClose={close} />
      <Center className="bg-yellow">
        <SyncButton
          onClick={open}
          loading={opened}/>
      </Center>
    </>
  );
}
