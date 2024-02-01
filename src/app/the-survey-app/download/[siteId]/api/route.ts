import {
  LocalDownloadSiteData,
  LocalSiteProject,
  createLocalData,
} from "@/lib/types/local";
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
  >`SELECT question.id, question.project_id, question.options, question_type.type, subheading.text AS subheading, question.text AS question, question.order 
                    FROM QUESTION 
                    JOIN question_type on question_type.id = question.question_type_id  
                    JOIN subheading on subheading.id = question.subheading_id 
                    WHERE project_id = ${projectId}`;

  // Step two download process
  const processes = await sql<
    ServerQuestion[]
  >`SELECT process.id, process.project_id, process.options, question_type.type, subheading.text AS subheading, process.text AS question, process.order 
                    FROM PROCESS 
                    JOIN question_type on question_type.id = process.question_type_id  
                    JOIN subheading on subheading.id = process.subheading_id 
                    WHERE project_id = ${projectId}`;

  // step three download rack questions
  const rackQuestions = await sql<
    ServerQuestion[]
  >`SELECT rack_question.id, rack_question.project_id, rack_question.options, question_type.type, rack_question.text AS question, rack_question.order 
                    FROM RACK_QUESTION
                    JOIN question_type on question_type.id = rack_question.question_type_id  
                    WHERE project_id = ${projectId}`;

  // step four download available question responses
  const questionResponses = await sql<ServerQuestionResponse[]>`SELECT *
                    FROM QUESTION_RESPONSE
                    WHERE question_id = ANY(${questions.map((q) => q.id)})`;

  // step five download available process responses
  const processResponses = await sql<ServerProcessResponse[]>`SELECT *
                    FROM PROCESS_RESPONSE
                    WHERE process_id = ANY(${processes.map((q) => q.id)})`;

  // Step six download available rack question responses
  const rackQuestionResponses = await sql<ServerRackQuestionResponse[]>`SELECT *
                    FROM RACK_QUESTION_RESPONSE
                    WHERE rack_question_id = ANY(${rackQuestions.map(
                      (q) => q.id,
                    )})`;

  // step seven download available rooms
  const rooms = await sql<ServerRoom[]>`SELECT *
                    FROM ROOM
                    WHERE project_id = ${projectId}`;

  // step eight download available racks and more info
  const racks = await sql<ServerRack[]>`SELECT *
                FROM RACK
                WHERE room_id = ANY(${rooms.map((r) => r.id)})`;

  const moreInfo = await sql<ServerMoreInfo[]>`SELECT *
                FROM MORE_INFO
                WHERE room_id = ANY(${rooms.map((r) => r.id)})`;

  const hardware = await sql<ServerHardware[]>`SELECT *
                FROM HARDWARE
                WHERE rack_id = ANY(${racks.map((r) => r.id)})`;

  // step files download files per each

  data["siteProject"] = transformEntryFromServer<
    ServerSiteProject,
    LocalSiteProject
  >(siteProjects[0]);
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
