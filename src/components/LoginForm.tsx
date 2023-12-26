"use client";

import { TextInput, Button, Group, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { redirect } from "next/navigation";

export default function LoginForm() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => redirect("the-survey-app/start"))}
      className="w-100"
    >
      <TextInput
        className="mb-4"
        withAsterisk
        label="eMail:"
        placeholder="your@email.com"
        {...form.getInputProps("email")}
      />

      <PasswordInput
        withAsterisk
        label="Password:"
        placeholder="Your password"
        {...form.getInputProps("password")}
      />

      <Group justify="flex-start" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}
