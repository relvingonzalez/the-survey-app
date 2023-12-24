export type SiteCode = string;

export type Site = {
    siteCode: SiteCode;
    location: string;
    questionnaire: string;
    answers: string;
    sketches: number;
    process: string;
};