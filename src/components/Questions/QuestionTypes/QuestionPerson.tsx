"use client";

import {
  Card,
  CardSection,
  Group,
  Select,
  TextInput,
  Text,
  GridCol,
  Grid,
  Button,
  ActionIcon,
} from "@mantine/core";
import { Person, PersonQuestion } from "@/lib/types/question";
import { emailPatternRegex } from "./QuestionEmail";
import { phonePatternRegex } from "./QuestionPhone";
import { useState } from "react";
import {
  IconTrash,
  IconLayoutGridAdd,
  IconX,
  IconUserPlus,
} from "@tabler/icons-react";
import { createPerson } from "@/lib/utils/functions";
import { UseFormReturnType, useForm } from "@mantine/form";
import { WithQuestionCallback } from "../Question";

export type QuestionPersonProps = {
  question: PersonQuestion;
} & WithQuestionCallback<PersonQuestion["answer"]["value"]>;

export const salutationOptions = ["Mr", "Ms"];

function NewPerson({
  form,
  onSave,
  onCancel,
}: {
  form: UseFormReturnType<Person>;
  onSave: (person: Person) => void;
  onCancel: () => void;
}) {
  return (
    <Card withBorder shadow="sm" radius="md">
      <CardSection withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Text size="xl" fw={500}>
            New Contact
          </Text>
          <ActionIcon variant="subtle" color="gray" onClick={onCancel}>
            <IconX />
          </ActionIcon>
        </Group>
      </CardSection>
      <CardSection inheritPadding py="xs">
        <form onSubmit={form.onSubmit((values) => onSave(values))}>
          <Select
            name="salutaion"
            label="Select Salutation"
            placeholder="--Select One--"
            withAsterisk
            data={salutationOptions}
            {...form.getInputProps("salut")}
          />
          <TextInput
            label="First Name"
            placeholder="John"
            withAsterisk
            {...form.getInputProps("firstName", { withError: true })}
          />
          <TextInput
            label="Last Name"
            placeholder="Smith"
            withAsterisk
            {...form.getInputProps("lastName")}
          />
          <TextInput
            label="Email"
            type="email"
            withAsterisk
            placeholder="email@example.com"
            {...form.getInputProps("email")}
          />
          <TextInput
            label="Telephone"
            type="tel"
            withAsterisk
            placeholder="9-(999)999-9999"
            {...form.getInputProps("phone")}
          />
          <Button
            mt="10"
            disabled={!form.isValid}
            type="submit"
            leftSection={<IconUserPlus />}
          >
            Save
          </Button>
        </form>
      </CardSection>
    </Card>
  );
}

function ExistingPerson({
  person,
  onDelete,
}: {
  person: Person;
  onDelete: () => void;
}) {
  return (
    <Card withBorder shadow="sm" radius="md">
      <CardSection withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Text size="xl" fw={500}>
            {person.salut} {person.firstName} {person.lastName}
          </Text>
          <ActionIcon variant="subtle" color="red" onClick={onDelete}>
            <IconTrash />
          </ActionIcon>
        </Group>
      </CardSection>
      <CardSection inheritPadding py="xs">
        <Text>{person.email}</Text>
        <Text>{person.phone}</Text>
      </CardSection>
    </Card>
  );
}

export default function QuestionText({
  question,
  onAnswered,
}: QuestionPersonProps) {
  const [addNew, setAddNew] = useState(
    !question.answer.value.length ? true : false,
  );
  const onAddNewClick = () => {
    setAddNew(true);
  };

  const resetNewPerson = () => {
    form.reset();
    setAddNew(false);
  };

  const onSaveNewPerson = (person: Person) => {
    const newPersons = [...question.answer.value];
    newPersons.push(person);
    onAnswered(newPersons);
    resetNewPerson();
  };

  const onDeletePerson = (i: number) => {
    console.log("delete " + i);
    const newPersons = [...question.answer.value];
    newPersons.splice(i, 1);
    onAnswered(newPersons);
  };

  const form = useForm({
    initialValues: createPerson(),
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: {
      salut: (value) =>
        value && salutationOptions.includes(value)
          ? null
          : "Select a salutation",
      firstName: (value) => (value ? null : "First name is required"),
      lastName: (value) => (value ? null : "Last name is required"),
      email: (value) =>
        emailPatternRegex.test(value) ? null : "Invalid email",
      phone: (value) =>
        phonePatternRegex.test(value) ? null : "Invalid phone number",
    },
  });

  return (
    <Grid>
      {question.answer.value.map((p, i) => (
        <GridCol key={i} span={4}>
          <ExistingPerson person={p} onDelete={() => onDeletePerson(i)} />
        </GridCol>
      ))}
      <GridCol span={4}>
        {addNew ? (
          <NewPerson
            form={form}
            onSave={onSaveNewPerson}
            onCancel={resetNewPerson}
          />
        ) : (
          <Button onClick={onAddNewClick} leftSection={<IconLayoutGridAdd />}>
            Add New
          </Button>
        )}
      </GridCol>
    </Grid>
  );
}
