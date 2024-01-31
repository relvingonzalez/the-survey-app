import { createServerData } from "@/lib/data/data";
import { DownloadSiteData } from "@/lib/types/data";
import postgres from "postgres";

export async function GET(
  request: Request,
  { params }: { params: { siteId: number } },
) {
  const data: DownloadSiteData = createServerData();
  const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
  const projectId =
    await sql`SELECT DISTINCT id FROM  PROJECT where site_id = ${params.siteId} LIMIT 1`; // add customer id

  data["projectId"] = projectId[0].id;

  // step one download questions
  data["questions"] =
    await sql`SELECT question.id, question.options, question_type.type, subheading.text AS subheading, question.text AS question, question.order 
                    FROM QUESTION 
                    JOIN question_type on question_type.id = question.question_type_id  
                    JOIN subheading on subheading.id = question.subheading_id 
                    WHERE project_id = ${data["projectId"]}`;

  // Step two download process
  data["processes"] =
    await sql`SELECT process.id, process.options, question_type.type, subheading.text AS subheading, process.text AS question, process.order 
                    FROM PROCESS 
                    JOIN question_type on question_type.id = process.question_type_id  
                    JOIN subheading on subheading.id = process.subheading_id 
                    WHERE project_id = ${data["projectId"]}`;

  // step three download rack questions
  data["rackQuestions"] =
    await sql`SELECT rack_question.id, rack_question.options, question_type.type, rack_question.text AS question, rack_question.order 
                    FROM RACK_QUESTION
                    JOIN question_type on question_type.id = rack_question.question_type_id  
                    WHERE project_id = ${data["projectId"]}`;

  // step four download available question responses
  data["questionResponses"] = await sql`SELECT *
                    FROM QUESTION_RESPONSE
                    WHERE question_id = ANY(${data["questions"].map(
                      (q) => q.id,
                    )})`;

  // step five download available process responses
  data["processResponses"] = await sql`SELECT *
                    FROM PROCESS_RESPONSE
                    WHERE process_id = ANY(${data["processes"].map(
                      (q) => q.id,
                    )})`;

  // Step six download available rack question responses
  data["rackQuestionResponses"] = await sql`SELECT *
                    FROM RACK_QUESTION_RESPONSE
                    WHERE rack_question_id = ANY(${data["rackQuestions"].map(
                      (q) => q.id,
                    )})`;

  // step seven download available rooms
  data["rooms"] = await sql`SELECT *
                    FROM ROOM
                    WHERE project_id = ${data["projectId"]}`;

  // step eight download available racks and more info
  data["racks"] = await sql`SELECT *
                FROM RACK
                WHERE room_id = ANY(${data["rooms"].map((r) => r.id)})`;

  data["moreInfo"] = await sql`SELECT *
                FROM MORE_INFO
                WHERE room_id = ANY(${data["rooms"].map((r) => r.id)})`;

  data["hardware"] = await sql`SELECT *
                FROM HARDWARE
                WHERE rack_id = ANY(${data["racks"].map((r) => r.id)})`;

  // step files download files per each

  return Response.json(data);
}
