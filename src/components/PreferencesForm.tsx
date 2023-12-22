'use client'

import { TextInput, Button, Group, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { redirect } from 'next/navigation';


export default function LoginForm() {
  const form = useForm({
    initialValues: {
      email: 'rs@orga.zone',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <>
        <form onSubmit={form.onSubmit((values) => redirect('the-survey-app/start'))} className="w-100">
        <TextInput
            className="mb-4"
            disabled
            label="Logged in as:"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
        />

        <PasswordInput
            withAsterisk
            label="New Password:"
            placeholder="Your password"
            {...form.getInputProps('password')}
            />

        <Group justify="flex-start" mt="md">
            <Button type="submit">Update Password</Button>
        </Group>
        </form>
        <Group justify="flex-start" mt="md">
            <Button variant="warning">Logout</Button>
            <Button variant="danger">Logout Without Sync</Button>
        </Group>
    </>

  );
}