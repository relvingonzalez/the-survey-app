import { DownloadSites } from "@/components/Sites/Sites";
import sql from "@/lib/api//db";
import { LocalSiteProject } from "@/lib/types/local";

async function getData() {
  const response = await sql<
    LocalSiteProject[]
  >`SELECT project.id AS project_id, site.id, site.name, site.site_code, site.street, site.city, site.state, site.phone 
                                                    FROM PROJECT
                                                    JOIN SITE on project.site_id = site.id `;
  return response;
}

export default async function DownloadPage() {
  const sites = await getData();
  return <DownloadSites sites={sites} />;
}
