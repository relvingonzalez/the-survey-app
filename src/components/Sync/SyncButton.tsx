"use client";

import { Button, ButtonProps } from "@mantine/core";
import { useNetwork } from "@mantine/hooks";
import { IconRefresh } from "@tabler/icons-react";
import { MouseEventHandler } from "react";

export type SyncButtonProps = ButtonProps & {
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function SyncButton({ ...props }: SyncButtonProps) {
  const networkStatus = useNetwork();

  return (
    <Button
      className="border-0 bg-transparent"
      disabled={!networkStatus.online}
      leftSection={<IconRefresh />}
      loaderProps={{ type: "dots" }}
      {...props}
    >
      Sync
    </Button>
  );
}
