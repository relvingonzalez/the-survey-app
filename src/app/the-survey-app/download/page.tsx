import { DownloadSites } from "@/components/Sites/Sites";
import { Site } from "@/lib/types/sites";
import postgres from "postgres";
import { transformEntriesFromServer } from "@/lib/utils/functions";
import { ServerSite } from "@/lib/types/server";

async function getData() {
  const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
  const response = await sql<ServerSite[]>`SELECT * FROM site`;
  return transformEntriesFromServer<ServerSite, Site>(response);
}

export default async function DownloadPage() {
  const sites = await getData();
  return <DownloadSites sites={sites} />;
}
