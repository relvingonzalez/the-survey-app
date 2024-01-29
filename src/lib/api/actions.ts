"use server";

import postgres from "postgres";
//import * as changeKeys from "change-case/keys";
import { Site } from "../types/sites";

export async function downloadSite(site: Site) {
  const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
  const projectId =
    await sql`SELECT DISTINCT id FROM  PROJECT where site_id = ${site.id}`; // add customer id
  console.log(projectId);
  // step one download questions
  const questions =
    await sql`SELECT question.id, question_type.type, subheading.text AS subheading, question.text AS question, question.order 
 FROM QUESTION 
 JOIN question_type on question_type.id = question.question_type_id  
 JOIN subheading on subheading.id = question.subheading_id 
 WHERE project_id = ${projectId[0].id}`; // add customer id

  console.log(questions);
  // Step two download process

  // step three download rack questions

  // step four download available question responses

  // step five download available process responses

  // step six download available rooms

  // step seven download available racks and more info

  // step eight download files per each
}
