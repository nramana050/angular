export interface QualificationStatus{
    id: number,
    value: string
}

export interface CourseDetails{
    courseId: number,
    courseName: string,
    isCourseCompleted: boolean,
    learnerCourseDetails: any
}

export interface LearnerCourseDetails{
    learnerId: number,
    firstName: string,
    lastName: string,
    isCompleted: boolean,
    qualificationOutcome: any
}
