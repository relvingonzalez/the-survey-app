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
import { Person, Salutation } from "@/lib/types/question";
import { phonePatternRegex } from "./QuestionPhone";
import { useState } from "react";
import {
  IconTrash,
  IconLayoutGridAdd,
  IconX,
  IconUserPlus,
} from "@tabler/icons-react";
import { UseFormReturnType, isEmail, matches, useForm } from "@mantine/form";
import { WithQuestionCallbacks } from "../SurveyItem";
import { Question, Response } from "../../../../internal";

export type QuestionPersonProps = {
  question: Question;
  response: Response[];
} & WithQuestionCallbacks;

const salutationLabels = ["Mr", "Ms"];
const salutationValues = ["1", "2"];
const salutations: Record<number, Salutation> = {
  1: "Mr",
  2: "Ms",
};
export const salutationOptions = salutationLabels.map((_, i) => ({
  label: salutationLabels[i],
  value: salutationValues[i],
}));

export const createPersonResponse = (
  { projectId, id: questionId, responseType }: Question,
  {
    salutationId = -1,
    firstName = "",
    lastName = "",
    email = "",
    phone = "",
  }: Person,
) =>
  Response.create({
    projectId,
    questionId,
    responseType,
    salutationId,
    firstName,
    lastName,
    email,
    phone,
  });

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
            name="salutation"
            label="Select Salutation"
            placeholder="--Select One--"
            withAsterisk
            data={salutationOptions}
            {...form.getInputProps("salutationId")}
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
            {person.salutationId && salutations[person.salutationId]}{" "}
            {person.firstName} {person.lastName}
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

export default function QuestionPerson({
  question,
  response,
  onAnswered,
  onDeleted,
}: QuestionPersonProps) {
  const [addNew, setAddNew] = useState(false);
  const onAddNewClick = () => {
    setAddNew(true);
  };

  const resetNewPerson = () => {
    form.reset();
    setAddNew(false);
  };

  const onSaveNewPerson = (person: Person) => {
    onAnswered(createPersonResponse(question, person));
    resetNewPerson();
  };

  const onDeletePerson = (r: Response) => {
    onDeleted(r);
  };

  const form = useForm({
    initialValues: {
      salutationId: -1,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    } as Person,
    validateInputOnChange: true,
    clearInputErrorOnChange: true,
    validate: {
      salutationId: (value) =>
        value && salutationValues.includes(value.toString())
          ? null
          : "Select a salutation",
      firstName: (value) => (value ? null : "First name is required"),
      lastName: (value) => (value ? null : "Last name is required"),
      email: isEmail("Invalid email"),
      phone: matches(phonePatternRegex, "Invalid phone number"),
    },
  });

  return (
    <Grid>
      {response.map((p, i) => (
        <GridCol key={i} span={4}>
          <ExistingPerson person={p} onDelete={() => onDeletePerson(p)} />
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
