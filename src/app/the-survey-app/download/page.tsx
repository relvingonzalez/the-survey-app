import { DownloadSites } from "@/components/Sites/Sites";
import { Site } from "@/lib/types/sites";
import postgres from "postgres";
import * as changeKeys from "change-case/keys";

async function getData() {
  const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

  const response = await sql<Site[]>`SELECT * FROM site`;
  return response.map((v) => changeKeys.camelCase(v) as Site);
}

export default async function DownloadPage() {
  const sites = await getData();
  return <DownloadSites sites={sites} />;
}
