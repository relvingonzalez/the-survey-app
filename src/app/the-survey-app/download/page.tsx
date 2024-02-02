import { DownloadSites } from "@/components/Sites/Sites";
import postgres from "postgres";
import { transformEntriesFromServer } from "@/lib/utils/functions";
import { ServerSiteProject } from "@/lib/types/server";
import { LocalSiteProject } from "@/lib/types/local";

async function getData() {
  const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
  const response = await sql<
    ServerSiteProject[]
  >`SELECT project.id AS project_id, site.id, site.name, site.site_code, site.street, site.city, site.state, site.phone 
                                                    FROM PROJECT
                                                    JOIN SITE on project.site_id = site.id `;
  return transformEntriesFromServer<ServerSiteProject, LocalSiteProject>(
    response,
  );
}

export default async function DownloadPage() {
  const sites = await getData();
  return <DownloadSites sites={sites} />;
}
