export interface Job {
    id: string;
    jobTitle: string;
    jobId: string,
    postingDate: string;
    closingDate: string;
    location: string;
    pay: string;
    status: string;
}

export interface JobInterested{
    dateExpressed:string;
    serviceUserName: string;
    serviceUserPRN: string;
    suOrganization: string;
}
export interface ExpressionOfInterest{
    dateExpressed: string;
    serviceUserName: string;
    jobStatus: string;
    jobTitle: string;
    earliestReleaseDate: string;
    status: string;
}