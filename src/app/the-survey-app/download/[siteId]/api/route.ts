import { LocalDownloadSiteData, createLocalData } from "@/lib/types/local";
import {
  ServerHardware,
  ServerMoreInfo,
  ServerProcessResponse,
  ServerQuestion,
  ServerQuestionResponse,
  ServerRack,
  ServerRackQuestionResponse,
  ServerRoom,
  ServerSiteProject,
} from "@/lib/types/server";
import {
  transformEntriesFromServer,
  transformEntryFromServer,
} from "@/lib/utils/functions";
import postgres from "postgres";

export async function GET(
  request: Request,
  { params }: { params: { siteId: number } },
) {
  const data: LocalDownloadSiteData = createLocalData();
  const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
  const siteProjects = await sql<
    ServerSiteProject[]
  >`SELECT DISTINCT project.id AS project_id, site.id, site.name, site.site_code, site.street, site.city, site.state, site.phone 
FROM PROJECT
JOIN SITE on project.site_id = site.id 
WHERE site_id = ${params.siteId} LIMIT 1`; // add customer id

  const projectId = siteProjects[0].project_id;
  // step one download questions
  const questions = await sql<
    ServerQuestion[]
  >`SELECT question.id, question.project_id, question.options, question_type.type, subheading.text AS subheading, question.text AS question, question.order FROM QUESTION JOIN question_type on question_type.id = question.question_type_id JOIN subheading on subheading.id = question.subheading_id WHERE project_id = ${projectId}`;

  // Step two download process
  const processes = await sql<
    ServerQuestion[]
  >`SELECT process.id, process.project_id, process.options, question_type.type, subheading.text AS subheading, process.text AS question, process.order FROM process JOIN question_type on question_type.id = process.question_type_id JOIN subheading on subheading.id = process.subheading_id WHERE project_id = ${projectId}`;

  // step three download rack questions
  const rackQuestions = await sql<
    ServerQuestion[]
  >`SELECT rack_question.id, rack_question.project_id, rack_question.options, question_type.type, rack_question.text AS question, rack_question.order FROM RACK_QUESTION JOIN question_type on question_type.id = rack_question.question_type_id WHERE project_id = ${projectId}`;

  // step four download available question responses
  const questionResponses = await sql<
    ServerQuestionResponse[]
  >`SELECT question.project_id, question_response.* FROM question_response INNER JOIN question USING (id) WHERE project_id = ${projectId}`;

  // step five download available process responses
  const processResponses = await sql<
    ServerProcessResponse[]
  >`SELECT process.project_id, process_response.* FROM process_response INNER JOIN process USING (id) WHERE project_id = ${projectId}`;

  // Step six download available rack question responses
  const rackQuestionResponses = await sql<
    ServerRackQuestionResponse[]
  >`SELECT rack_question.project_id, rack_question_response.* FROM rack_question_response INNER JOIN rack_question USING (id) WHERE project_id = ${projectId}`;

  // step seven download available rooms
  const rooms = await sql<
    ServerRoom[]
  >`SELECT * FROM ROOM WHERE project_id = ${projectId}`;

  // step eight download available racks and more info
  const racks = await sql<
    ServerRack[]
  >`SELECT room.project_id, rack.* FROM rack INNER JOIN room USING (id) WHERE project_id = ${projectId}`;

  const moreInfo = await sql<
    ServerMoreInfo[]
  >`SELECT room.project_id, more_info.* FROM more_info INNER JOIN room USING (id) WHERE project_id = ${projectId}`;

  const hardware = await sql<
    ServerHardware[]
  >`SELECT room.project_id, hardware.* FROM hardware INNER JOIN rack USING (id) INNER JOIN room USING (id) WHERE project_id = ${projectId}`;

  // step files download files per each

  data["siteProject"] = transformEntryFromServer(siteProjects[0]);
  data["questions"] = transformEntriesFromServer(questions);
  data["processes"] = transformEntriesFromServer(processes);
  data["rackQuestions"] = transformEntriesFromServer(rackQuestions);
  data["questionResponses"] = transformEntriesFromServer(questionResponses);
  data["processResponses"] = transformEntriesFromServer(processResponses);
  data["rackQuestionResponses"] = transformEntriesFromServer(
    rackQuestionResponses,
  );
  data["rooms"] = transformEntriesFromServer(rooms);
  data["racks"] = transformEntriesFromServer(racks);
  data["moreInfos"] = transformEntriesFromServer(moreInfo);
  data["hardwares"] = transformEntriesFromServer(hardware);

  return Response.json(data);
}
