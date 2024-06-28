"use server";

import sql from "./db";
import { DexieComment, DexieResponse } from "../types/dexie";
import { Comment } from "../types/question_new";
import {
  ServerCheckboxResponse,
  ServerDateTimeResponse,
  ServerDaysResponse,
  ServerEmailResponse,
  ServerGeoResponse,
  ServerNumberResponse,
  ServerPersonResponse,
  ServerPhoneResponse,
  ServerTextResponse,
  ServerTimeResponse,
  ServerYesNoResponse,
} from "../types/server_new";
import { transformResponseToServerResponse } from "../utils/functions";

export async function saveComments(comments: DexieComment[]) {
  const result: Comment[] = await sql`INSERT INTO question_response ${sql(
    comments,
    "questionId",
    "comment",
    "collectionOrder",
  )} 
  ON CONFLICT (question_id) 
  DO UPDATE SET
    comment = EXCLUDED.comment,
    collection_order = EXCLUDED.collection_order
    RETURNING *;`;

  return result;
}

export async function saveResponses(responses: DexieResponse[]) {
  const checkboxResponses = responses
    .filter((r) => r.responseType === "checkbox")
    .map(transformResponseToServerResponse) as ServerCheckboxResponse[];
  const datetimeResponses = responses
    .filter((r) => r.responseType === "datetime")
    .map(transformResponseToServerResponse) as ServerDateTimeResponse[];
  const daysResponses = responses
    .filter((r) => r.responseType === "days")
    .map(transformResponseToServerResponse) as ServerDaysResponse[];
  const emailResponses = responses
    .filter((r) => r.responseType === "email")
    .map(transformResponseToServerResponse) as ServerEmailResponse[];
  const geoResponses = responses
    .filter((r) => r.responseType === "geo")
    .map(transformResponseToServerResponse) as ServerGeoResponse[];
  const numberResponses = responses
    .filter((r) => r.responseType === "number")
    .map(transformResponseToServerResponse) as ServerNumberResponse[];
  const personResponses = responses
    .filter((r) => r.responseType === "person")
    .map(transformResponseToServerResponse) as ServerPersonResponse[];
  const phoneResponses = responses
    .filter((r) => r.responseType === "phone")
    .map(transformResponseToServerResponse) as ServerPhoneResponse[];
  const textResponses = responses
    .filter(
      (r) =>
        r.responseType === "text" ||
        r.responseType === "multiple" ||
        r.responseType === "list",
    )
    .map(transformResponseToServerResponse) as ServerTextResponse[];
  const timeResponses = responses
    .filter((r) => r.responseType === "time")
    .map(transformResponseToServerResponse) as ServerTimeResponse[];
  const yesNoResponses = responses
    .filter((r) => r.responseType === "yes/no")
    .map(transformResponseToServerResponse) as ServerYesNoResponse[];

  console.log("peepz", personResponses);

  return await sql.begin(async (sql) => {
    const [checkbox] = checkboxResponses.length
      ? await sql`
      INSERT INTO checkbox_question_response ${sql(checkboxResponses)} 
      ON CONFLICT (id) 
      DO UPDATE SET
        label = EXCLUDED.label,
        checked = EXCLUDED.checked
      RETURNING *`
      : [];

    const [dateTime] = datetimeResponses.length
      ? await sql`
      INSERT INTO datetime_question_response ${sql(datetimeResponses)} 
      ON CONFLICT (id) 
      DO UPDATE SET
        date = EXCLUDED.date
      RETURNING *`
      : [];

    const [day] = daysResponses.length
      ? await sql`
      INSERT INTO days_question_response ${sql(daysResponses)} 
      ON CONFLICT (id) 
      DO UPDATE SET
        dayId = EXCLUDED.day_id
      RETURNING *`
      : [];

    const [email] = emailResponses.length
      ? await sql`
      INSERT INTO email_question_response ${sql(emailResponses)} 
      ON CONFLICT (id) 
      DO UPDATE SET
        email = EXCLUDED.email
      RETURNING *`
      : [];

    const [geo] = geoResponses.length
      ? await sql`
      INSERT INTO geo_question_response ${sql(geoResponses)} 
      ON CONFLICT (id) 
      DO UPDATE SET
        geog = EXCLUDED.geog
      RETURNING *`
      : [];

    const [person] = personResponses.length
      ? await sql`
      INSERT INTO person_question_response ${sql(personResponses)} 
      ON CONFLICT (id) 
      DO UPDATE SET
      ${Object.keys(personResponses[0]).map(
        (x, i) => sql`${i ? sql`,` : sql``}${sql(x)} = excluded.${sql(x)}`,
      )}
      RETURNING *`
      : [];

    const [number] = numberResponses.length
      ? await sql`
      INSERT INTO number_question_response ${sql(numberResponses)} 
      ON CONFLICT (id) 
      DO UPDATE SET
        number = EXCLUDED.number
      RETURNING *`
      : [];

    const [phone] = phoneResponses.length
      ? await sql`
      INSERT INTO phone_question_response ${sql(phoneResponses)} 
      ON CONFLICT (id) 
      DO UPDATE SET
        phone = EXCLUDED.phone
      RETURNING *`
      : [];

    const [text] = textResponses.length
      ? await sql`
      INSERT INTO text_question_response ${sql(textResponses)} 
      ON CONFLICT (id) 
      DO UPDATE SET
        text = EXCLUDED.text
      RETURNING *`
      : [];

    const [time] = timeResponses.length
      ? await sql`
      INSERT INTO time_question_response ${sql(timeResponses)} 
      ON CONFLICT (id) 
      DO UPDATE SET
        fromTime = EXCLUDED.from_time,
        toTime = EXCLUDED.to_time
      RETURNING *`
      : [];

    const [yesNo] = yesNoResponses.length
      ? await sql`
      INSERT INTO yes_no_question_response ${sql(yesNoResponses)} 
      ON CONFLICT (id) 
      DO UPDATE SET
        yesNo = EXCLUDED.yes_no
      RETURNING *`
      : [];

    return [
      checkbox,
      dateTime,
      day,
      email,
      geo,
      number,
      person,
      phone,
      text,
      time,
      yesNo,
    ];
  });
}
