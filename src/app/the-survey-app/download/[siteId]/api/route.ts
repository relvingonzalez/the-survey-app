import { LocalDownloadSiteData, createLocalData } from "@/lib/types/local_new";
import {
  ServerComment,
  ServerHardware,
  ServerMoreInfo,
  ServerQuestion,
  ServerRack,
  ServerResponse,
  ServerRoom,
  ServerSiteProject,
} from "@/lib/types/server_new";
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
  >`Select * FROM site_project WHERE id = ${params.siteId}`; // add customer id

  const projectId = siteProjects[0].project_id;
  // step one download questions

  const questions = await sql<
    ServerQuestion[]
  >`SELECT * FROM questions WHERE project_id = ${projectId}`;

  const responses = await sql<
    ServerResponse[]
  >`SELECT * FROM responses WHERE project_id = ${projectId}`;

  const comments = await sql<
    ServerComment[]
  >`SELECT * FROM comment WHERE project_id = ${projectId}`;

  // step seven download available rooms
  const rooms = await sql<
    ServerRoom[]
  >`SELECT * FROM room WHERE project_id = ${projectId}`;

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
  data["responses"] = transformEntriesFromServer(responses);
  data["comments"] = transformEntriesFromServer(comments);
  data["rooms"] = transformEntriesFromServer(rooms);
  data["racks"] = transformEntriesFromServer(racks);
  data["moreInfos"] = transformEntriesFromServer(moreInfo);
  data["hardwares"] = transformEntriesFromServer(hardware);

  return Response.json(data);
}
