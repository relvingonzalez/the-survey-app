import { SiteCode } from "@/lib/types/sites"

export async function getSite(siteCode: SiteCode) {
    const res = await fetch(`${process.env.API_URL}/site/${siteCode}`)
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
   
    console.log(process.env.API_URL, res);
    // if (!res.ok) {
    //   // This will activate the closest `error.js` Error Boundary
    //   throw new Error('Failed to fetch data')
    // }
   
    return res.json()
}