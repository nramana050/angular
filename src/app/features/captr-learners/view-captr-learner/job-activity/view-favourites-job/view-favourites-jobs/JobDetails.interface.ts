export interface JobDetails {
    id: string;
    job_title: string;
    date: string;
    location_coordinates: string;
    location_name: string;
    organization_name: string;
    profession_class: string;
    sequence_number: string;
    job_description: string;
    contract_type: string;
    salary: number;
    organizationIndustry: string;
    candidate_description: string;
    employer_description: string;
    conditions_description: string;
    color: string;
    jobImgUrl: string;
    source_url: string;
    advertiser_reference_number: string;
    isFavourite: boolean;
    isApplied: boolean;
    applicationStatusDate: string;
    source_website: string;
    advertiser_email: string;
    advertiser_website: string;
    advertiser_type: string;
}