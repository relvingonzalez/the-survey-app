import { LocalSites } from "@/components/Sites/Sites";
import { dummySites } from "@/lib/data/sites";

export default function DownloadPage() {
    return (
        <LocalSites sites={dummySites}/>
      );
}