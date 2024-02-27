import {
  LocalDownloadSiteData,
  LocalHardware,
  LocalMoreInfo,
  LocalRack,
  LocalRoom,
  LocalSiteProject,
  createLocalData,
} from "@/lib/types/local_new";
import sql from "@/lib/api//db";
import { Question, QuestionResponse, Comment } from "@/lib/types/question_new";

export async function GET(
  request: Request,
  { params }: { params: { siteId: number } },
) {
  const data: LocalDownloadSiteData = createLocalData();
  const [siteProject] = await sql<
    LocalSiteProject[]
  >`Select * FROM site_project WHERE id = ${params.siteId}`; // add customer id

  const projectId = siteProject.projectId;
  data["siteProject"] = siteProject;

  // step one download questions
  data["questions"] = await sql<
    Question[]
  >`SELECT * FROM questions WHERE project_id = ${projectId}`;

  data["responses"] = await sql<
    QuestionResponse[]
  >`SELECT * FROM responses WHERE project_id = ${projectId}`;

  data["comments"] = await sql<
    Comment[]
  >`SELECT * FROM comment WHERE project_id = ${projectId}`;

  // step seven download available rooms
  data["rooms"] = await sql<
    LocalRoom[]
  >`SELECT * FROM room WHERE project_id = ${projectId}`;

  // step eight download available racks and more info
  data["racks"] = await sql<
    LocalRack[]
  >`SELECT room.project_id, rack.* FROM rack INNER JOIN room USING (id) WHERE project_id = ${projectId}`;

  data["moreInfos"] = await sql<
    LocalMoreInfo[]
  >`SELECT room.project_id, more_info.* FROM more_info INNER JOIN room USING (id) WHERE project_id = ${projectId}`;

  data["hardwares"] = await sql<
    LocalHardware[]
  >`SELECT room.project_id, hardware.* FROM hardware INNER JOIN rack USING (id) INNER JOIN room USING (id) WHERE project_id = ${projectId}`;

  // step files download files per each
  return Response.json(data);
}
