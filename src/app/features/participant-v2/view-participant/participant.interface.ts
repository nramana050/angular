
  export interface PrimaryLearnerDetails {
    id: number
    firstName: string
    lastName: string
    dateOfBirth: string
    gender: number
    niNumber: string
    uln: any
    isBritishNational: any
    isResidentOfUKorEEA: any
    workerId: number
    workerTelephoneNo: any
    userCategoryId: any
  }
  
  export interface ContactDetails {
    id: any
    addressLine1: string
    addressLine2: string
    townOrCity: string
    county: string
    postCode: string
    emailAddress: string
    contactNo: string
    addressTenureInMonth: any
    addressTenureInyear: any
  }
  
  export interface EmergencyContact {
    firstName: string
    contactNo: string
    relationshipWithUser: any
  }
  
  export interface UnEmploymentStatus {
    isLookingForWork: any
    lengthOfUnemployment: any
    jobCentreLocation: any
    workCoach: any
    benefitType: any
  }
  
  export interface EqualOpportunitiesMonitoring {
    disabilityOrLearningDifficultyId: any
    disabilityOrLearningDifficultyIds: any[]
    isMedicalCondition: any
    medicalCondition: any
    isSupportToLiteracy: any
    literacySupport: any
    isCareerRequirements: any
    careerRequirements: any
    isMotivationOfselfEsteem: any
    motivationOfselfEsteem: any
    isCriminalConvictions: any
    criminalConvictions: any
  }
  
  export interface EqualityAndDiversity {
    isEqualityAndDiversityInformationId: any
    caringResposibilities: any
    householdSituation: any
    marriedOrCivilParnership: any
    religionOrbeliefs: any
    otherReligionOrBeliefs: any
    sexualOrientation: any
    otherSexualOrientation: any
    ethnicity: any
    workingpattern: any
    flexibility: any
  }
  