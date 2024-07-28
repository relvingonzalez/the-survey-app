import sql from "@/lib/api//db";
import { QuestionResponse } from "@/lib/types/question";
import {
  ServerSiteProject,
  ServerQuestion,
  ServerComment,
  ServerRoom,
  ServerRack,
  ServerMoreInfo,
  ServerHardware,
  createServerData,
  ServerDownloadSiteData,
} from "@/lib/types/server";

export async function GET(
  request: Request,
  { params }: { params: { siteId: number } },
) {
  const data: ServerDownloadSiteData = createServerData();
  const [siteProject] = await sql<
    ServerSiteProject[]
  >`Select * FROM site_project WHERE id = ${params.siteId}`; // add customer id

  const projectId = siteProject.projectId;
  data["siteProject"] = siteProject;

  // step one download questions
  data["questions"] = await sql<
    ServerQuestion[]
  >`SELECT * FROM questions WHERE project_id = ${projectId}`;

  data["responses"] = await sql<
    QuestionResponse[]
  >`SELECT * FROM responses WHERE project_id = ${projectId}`;

  data["comments"] = await sql<
    ServerComment[]
  >`SELECT * FROM comment WHERE project_id = ${projectId}`;

  // step seven download available rooms
  data["rooms"] = await sql<
    ServerRoom[]
  >`SELECT * FROM room WHERE project_id = ${projectId}`;

  // step eight download available racks and more info
  data["racks"] = await sql<
    ServerRack[]
  >`SELECT room.project_id, rack.* FROM rack INNER JOIN room USING (id) WHERE project_id = ${projectId}`;

  data["moreInfos"] = await sql<
    ServerMoreInfo[]
  >`SELECT room.project_id, more_info.* FROM more_info INNER JOIN room USING (id) WHERE project_id = ${projectId}`;

  data["hardwares"] = await sql<
    ServerHardware[]
  >`SELECT room.project_id, hardware.* FROM hardware INNER JOIN rack USING (id) INNER JOIN room USING (id) WHERE project_id = ${projectId}`;

  // step files download files per each
  return Response.json(data);
}
