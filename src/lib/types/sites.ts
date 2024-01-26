export type SiteCode = string;

export type Site = {
  id: number;
  name: string;
  siteCode: SiteCode;
  street: string;
  city: string;
  state: string;
  phone: string;
};
