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
} from "@mantine/core";
import { Person, PersonQuestion } from "@/lib/types/question";
import { emailPattern } from "./QuestionEmail";
import { phonePattern } from "./QuestionPhone";
import { useState } from "react";
import { IconTrash, IconLayoutGridAdd } from "@tabler/icons-react";
import { createPerson } from "@/lib/utils/functions";

export type QuestionPersonProps = {
  question: PersonQuestion;
};

export const salutationOptions = ["Mr", "Ms"];

function NewPerson({ person }: { person: Person }) {
  return (
    <Card withBorder shadow="sm" radius="md">
      <CardSection withBorder inheritPadding py="xs">
        <Group justify="start">
          <Text size="xl" fw={500}>
            New Contact
          </Text>
        </Group>
      </CardSection>
      <CardSection inheritPadding py="xs">
        <Select
          name="salutaion"
          label="Select Salutation"
          placeholder="--Select One--"
          data={salutationOptions}
          defaultValue={person.salut}
        />
        <TextInput
          label="First Name"
          placeholder="John"
          value={person.firstName}
        />
        <TextInput
          label="Last Name"
          placeholder="Smith"
          value={person.lastName}
        />
        <TextInput
          label="Email"
          placeholder="email@example.com"
          value={person.email}
          pattern={emailPattern}
        />
        <TextInput
          label="Telephone"
          placeholder="9-(999)999-9999"
          value={person.phone}
          pattern={phonePattern}
        />
      </CardSection>
    </Card>
  );
}

function ExistingPerson({ person }: { person: Person }) {
  return (
    <Card withBorder shadow="sm" radius="md">
      <CardSection withBorder inheritPadding py="xs">
        <Group justify="start">
          <Text size="xl" fw={500}>
            {person.salut} {person.firstName} {person.lastName}
          </Text>
          <IconTrash />
        </Group>
      </CardSection>
      <CardSection inheritPadding py="xs">
        <Text>{person.email}</Text>
        <Text>{person.phone}</Text>
      </CardSection>
    </Card>
  );
}

export default function QuestionText({ question }: QuestionPersonProps) {
  const [addNew, setAddNew] = useState(
    !question.answer.value.length ? true : false,
  );
  const onAddNewClick = () => {
    setAddNew(true);
  };
  return (
    <Grid>
      {question.answer.value.map((p, i) => (
        <GridCol key={i} span={4}>
          <ExistingPerson person={p} />
        </GridCol>
      ))}
      <GridCol span={4}>
        {addNew ? (
          <NewPerson person={createPerson()} />
        ) : (
          <Button onClick={onAddNewClick} leftSection={<IconLayoutGridAdd />}>
            Add New
          </Button>
        )}
      </GridCol>
    </Grid>
  );
}
