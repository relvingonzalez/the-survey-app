"use client";

import {
  Anchor,
  Button,
  Group,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { MouseEventHandler, useEffect, useState } from "react";
import { WithQuestionCallback } from "../SurveyItem";
import { GeoQuestion } from "@/lib/types/question";
import Response from "@/lib/dexie/Response";

export type QuestionGeoProps = {
  question: GeoQuestion;
  response: Response[];
} & WithQuestionCallback &
  TextInputProps;

const options: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export const createGeoResponse = (
  question: GeoQuestion,
  lat = null,
  long = null,
): Response => {
  const response = Response.fromQuestion(question);
  response.lat = lat;
  response.long = long;
  return response;
};

const errors: PositionErrorCallback = (err) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

export default function QuestionGeo({
  question,
  response,
  onAnswered,
  ...props
}: QuestionGeoProps) {
  const responseValue = response[0] || createGeoResponse(question);
  const [value, setValue] = useState("");

  const pattern =
    "^[-+]?([1-8]?d(.d+)?|90(.0+)?),s*[-+]?(180(.0+)?|((1[0-7]d)|([1-9]?d))(.d+)?)$";
  const getLocation: MouseEventHandler<HTMLButtonElement> = () => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
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
    const { latitude: lat, longitude: long } = pos.coords;
    setValue(`${lat}, ${long}`);
    responseValue.lat = lat;
    responseValue.long = long;
    onAnswered(responseValue);
  };

  const onChange = (value: string) => {
    const coords = value.split(",");
    setValue(value);
    responseValue.lat = parseFloat(coords[0]);
    responseValue.long = parseFloat(coords[1]);
    onAnswered(responseValue);
  };

  useEffect(() => {
    if (!value && responseValue.lat) {
      setValue(`${responseValue.lat}, ${responseValue.long}`);
    }
  }, [responseValue, value]);

  return (
    <>
      <Group>
        <Button onClick={getLocation}>Get Gps</Button>
        <TextInput
          name="geo"
          placeholder="49.4550734,11.0794632"
          id="oGPS"
          value={value}
          pattern={pattern}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
        {responseValue && (
          <Anchor
            href={`https://maps.google.com/maps?q=${responseValue.lat},${responseValue.long}`}
          >
            Go to maps
          </Anchor>
        )}
      </Group>
    </>
  );
}
