import { DownloadSites } from "@/components/Sites/Sites";
import { dummySites } from "@/lib/data/sites";

export default function DownloadPage() {
  return <DownloadSites sites={dummySites} />;
}
