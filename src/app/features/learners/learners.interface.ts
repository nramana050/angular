export interface ILearners {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    niNumber: string;
    uln: string;
    highestLevelQualification: string;
    isBritishNational: string;
    isResidentOfUKorEEA: string;
    isValidDrivingLicence: string;
    isOwnCarDriver: string;
    hiVisSize: string;
    trouserWaistSize: string;
    shoeSize: string;

    contactDetails: {
        addressLine1: string;
        addressLine2: string;
        townOrCity: string;
        country: string;
        postCode: string;
        emailAddress: string;
        contactNo: string;
        addressTenureInMonth: string;
        addressTenureInyear: string;
    };

    emergencyContact: {
        firstName: string;
        contactNo: string;
        relationshipWithUser:string; 
    };

    unEmploymentStatus: {
        isLookingForWork: string;
        lengthOfUnemployment: string;
        jobCentreLocation: string;
        workCoach: string;
        benefitType: string;
    };

    equalOpportunitiesMonitoring: {
        disabilityOrLearningDifficultyId: string;
        disabilityOrLearningDifficultyIds: {
            disabilityOrLearningDifficulty: string[];
        };
        isMedicalCondition: string;
        medicalCondition: string;
        isSupportToLiteracy: string;
        literacySupport: string;
        isCareerRequirements: string;
        careerRequirements: string;
        isMotivationOfselfEsteem: string;
        motivationOfselfEsteem: string;
        isCriminalConvictions: string;
        criminalConvictions: string;
    };
    equalityAndDiversity: {
        isEqualityAndDiversityInformationId: string;
        caringResposibilities: string;
        householdSituation: string;
        marriedOrCivilParnership: string;
        religionOrbeliefs: string;
        otherReligionOrBeliefs: string;
        sexualOrientation: string;
        otherSexualOrientation: string;
        ethnicity: string;
        workingpattern: string;
        flexibility: string;
    }
}
  