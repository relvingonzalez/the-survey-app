"use client";

import {
  Anchor,
  Button,
  Group,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { GeoQuestion } from "@/lib/types/question";
import { MouseEventHandler, useEffect, useState } from "react";
import { WithQuestionCallback } from "../Question";

export type QuestionGeoProps = {
  question: GeoQuestion;
} & WithQuestionCallback<GeoQuestion["answer"]["value"]> &
  TextInputProps;

const options: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const errors: PositionErrorCallback = (err) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

export default function QuestionGeo({
  question,
  onAnswered,
  ...props
}: QuestionGeoProps) {
  const [coords, setCoords] = useState(question.answer.value.split(","));
  const pattern =
    "^[-+]?([1-8]?d(.d+)?|90(.0+)?),s*[-+]?(180(.0+)?|((1[0-7]d)|([1-9]?d))(.d+)?)$";
  const getLocation: MouseEventHandler<HTMLButtonElement> = () => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          console.log(result);
          if (result.state === "granted") {
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "prompt") {
            //If prompt then the user will be asked to give permission
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const success: PositionCallback = (pos) => {
    const crd = pos.coords;
    setCoords([`${crd.latitude}`, `${crd.longitude}`]);
  };

  useEffect(() => {
    onAnswered(coords.join(","));
  }, [coords]);

  return (
    <>
      <Group>
        <Button onClick={getLocation}>Get Gps</Button>
        <TextInput
          name="geo"
          placeholder="49.4550734,11.0794632"
          id="oGPS"
          value={question.answer.value}
          pattern={pattern}
          {...props}
        />
        {coords.length && (
          <Anchor
            href={`https://maps.google.com/maps?q=${coords[0]},${coords[1]}`}
          >
            Go to maps
          </Anchor>
        )}
      </Group>
    </>
  );
}
