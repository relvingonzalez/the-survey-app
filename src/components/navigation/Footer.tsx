import { Button, Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconRefresh } from '@tabler/icons-react';
import SyncModal from "../SyncModal";

export default function NavFooter() {
  const [opened, { open, close }] = useDisclosure(false);
    return (
      <>
      <SyncModal opened={opened} onClose={close} />
        <Center className="bg-yellow">
          <Button className="border-0 bg-transparent" onClick={open} leftSection={<IconRefresh />} loading={opened} loaderProps={{ type: 'dots' }}>Sync</Button>
        </Center>
      </>
    );
  }