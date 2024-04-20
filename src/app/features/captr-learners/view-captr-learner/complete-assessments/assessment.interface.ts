export interface IAssessmentTemplate {
    assessmentTemplateId: number;
    assessmentName: string;
    userId?: number;
    questionJson?: any;
    createdBy: string;
    createdDate: Date;
    updatedBy?: string;
    updatedDate?: Date;
    deletedDate?: Date;
    deleted?: boolean;
    status?: string;
    isActive?: boolean;
    archiveReason?: string;
    isPublished?: boolean;
    isCompleted: boolean;
    isPartiallyCompleted: boolean;
}
