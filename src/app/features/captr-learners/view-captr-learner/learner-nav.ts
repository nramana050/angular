import { Injectable } from '@angular/core';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';
const profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);

@Injectable()
export class LearnerNavigation {
  learnerSubMenu = {
    sectionName: 'User Profile',
    featureId: getFeatureIdForProfileUrl(profileUrl),
    description: ``,
    state: null,
    icon: 'bar_chart',
    menuItems: [
      {
        name: 'My Profile',
        featureId: getFeatureIdForProfileUrl(profileUrl),
        description: ``,
        state: `${profileUrl}/profile`,
        icon: null,
        submenu: []
      },
      {
        name: 'Plan',
        featureId: [123],
        description: ``,
        state: `${profileUrl}/plan-v2`,
        icon: null,
        submenu: []
      },
      {
        name: getLabelByProfileURl(profileUrl, 'Goals and actions', 'My to-do'),
        featureId: getFeatureIdForGoalsActions(profileUrl),
        description: ``,
        state: `${profileUrl}/plan`,
        icon: null,
        submenu: []
      },
      {
        name: 'Calendar',
        featureId: [103],
        description: ``,
        state: `${profileUrl}/calendar`,
        icon: null,
        submenu: []
      },
      {
        name: getLabelByProfileURl(profileUrl, 'Quizzes', 'Assessments'),
        featureId: [31],
        description: ``,
        state: `${profileUrl}/assessments`,
        icon: null,
        submenu: []
      },
      {
        name: "CVs",
        featureId: [32],
        description: ``,
        state: `${profileUrl}/cv`,
        icon: null,
        submenu: []
      },
      {
        name: 'Documents',
        featureId: [33],
        description: ``,
        state: `${profileUrl}/documents`,
        icon: null,
        submenu: []
      },
      {
        name: 'Certificates',
        featureId: [120],
        description: ``,
        state: `${profileUrl}/certificates`,
        icon: null,
        submenu: []
      },
      // {
      //   name: 'Secure Spaces',
      //   featureId: [20],
      //   description: ``,
      //   state: `${learnerRoute}/meet`,
      //   icon: null,
      //   submenu: []
      // },
      {
        name: 'Job Opportunities',
        featureId: [29],
        description: ``,
        state: `${profileUrl}/job-activity`,
        icon: null,
        submenu: []
      },
      {
        name: 'Useful Contacts',
        featureId: [77],
        description: ``,
        state: `${profileUrl}/useful-contacts`,
        icon: null,
        submenu: []
      },
      {
        name: 'My Performance Review',
        featureId: [87],
        description: ``,
        state: `${profileUrl}/performance-review`,
        icon: null,
        submenu: []
      },
      {
        name: getLabelByProfileURl(profileUrl, 'Person supported learning', 'Participant learning'),
        featureId: [89],
        description: ``,
        state: `${profileUrl}/digital-course-progress`,
        icon: null,
        submenu: []
      },
      {
        name: 'System interactions',
        featureId: [118],
        description: ``,
        state: `${profileUrl}/system-interactions`,
        icon: null,
        submenu: []
      },
      {
        name: 'Staff comments',
        featureId: [119],
        description: ``,
        state: `${profileUrl}/staff-comments`,
        icon: null,
        submenu: []
      },
    ]
  };
  learnerSubMenu1 = {
    sectionName: 'Case note',
    featureId: getFeatureIdForProfileUrl(profileUrl),
    description: ``,
    state: null,
    icon: 'bar_chart',
    menuItems: [
      {
        name: 'Case Notes',
        featureId: getFeatureIdForCaseNote(profileUrl),
        description: ``,
        state: `${profileUrl}/case-note`,
        icon: null,
        submenu: []
      },
   
      {
        name: 'Professional Documents',
        featureId: [57],
        description: ``,
        state: `${profileUrl}/professional-document`,
        icon: null,
        submenu: []
      },
      {
        name: 'Risk Assessment',
        featureId:getFeatureIdForRsikAssessment(profileUrl),
        description: ``,
        state: `${profileUrl}/risk-assessment`,
        icon: null,
        submenu: []
      },
      {
        name: 'Referrals',
        featureId: getFeatureIdForReferral(profileUrl),
        description: ``,
        state: `${profileUrl}/referral`,
        icon: null,
        submenu: []
      },
      {
        name: 'Job Readiness',
        featureId: [101],
        description: ``,
        state: `${profileUrl}/readiness`,
        icon: null,
        submenu: []
      }
    ]
  };
  learnerSubMenu2 = {
    sectionName: 'User Profile',
    featureId: getFeatureIdForProfileUrl(profileUrl),
    description: ``,
    state: null,
    icon: 'bar_chart',
    menuItems: [
      {
        name: 'My Profile',
        featureId: getFeatureIdForProfileUrl(profileUrl),
        description: ``,
        state: `${profileUrl}/profile`,
        icon: null,
        submenu: []
      },
      {
        name: 'My Performance Review',
        featureId: [87],
        description: ``,
        state: `${profileUrl}/performance-review`,
        icon: null,
        submenu: []
      },
    ]
  };
  learnerSubMenu3 = {
    sectionName: 'User Profile',
    featureId: getFeatureIdForProfileUrl(profileUrl),
    description: ``,
    state: null,
    icon: 'bar_chart',
    menuItems: [
      {
        name: 'My Profile',
        featureId: getFeatureIdForProfileUrl(profileUrl),
        description: ``,
        state: `${profileUrl}/profile`,
        icon: null,
        submenu: []
      }, {
        name: 'Assessments',
        featureId: [31],
        description: ``,
        state: `${profileUrl}/assessments`,
        icon: null,
        submenu: []
      }, {
        name: 'Documents',
        featureId: [33],
        description: ``,
        state: `${profileUrl}/documents`,
        icon: null,
        submenu: []
      }, {
        name: getLabelForDigitalCourseByProfileURl(profileUrl),
        featureId: [89],
        description: ``,
        state: `${profileUrl}/digital-course-progress`,
        icon: null,
        submenu: []
      },
      {
        name: 'System interactions',
        featureId: [118],
        description: ``,
        state: `${profileUrl}/system-interactions`,
        icon: null,
        submenu: []
      },
    ]}
}

function getFeatureIdForProfileUrl(profileUrl: string): number[] {
  if (profileUrl === 'mentivity-learner') {
    return [99];
  }else if(profileUrl === 'person-supported'){
    return [97];
  }else if(profileUrl === 'clink-learners'){
    return [113];
  }else if(profileUrl === 'rws-participant'){
    return [136];
  }else {
    return [9];
  }
}

 function getFeatureIdForGoalsActions(profileUrl: string): number[] {
  if(profileUrl === 'person-supported'){
     return [129];
   }else {
     return [30];
   }
 }

function getLabelByProfileURl(profileUrl: string, newTitle: string, oldTitle: string): string {
  return profileUrl === 'person-supported' ? newTitle : oldTitle;
}

 function getFeatureIdForCaseNote(profileUrl: string): number[] {
  if (profileUrl === 'mentivity-learner' || profileUrl === 'clink-learners') {
    return [109];
  }else if(profileUrl === 'person-supported'){
    return [112];
  }else {
    return [56];
  }
  


}

  function getFeatureIdForReferral(profileUrl: string): number[] {
    if (profileUrl === 'mentivity-learner') {
      return [124];
    }else if(profileUrl === 'person-supported'){
      return [110];
    }else if(profileUrl === 'clink-learners'){
      return [128];
    }else {
      return [81];
    }
  }
function getFeatureIdForRsikAssessment(profileUrl: string) {
 if(profileUrl === 'clink-learners'){
    return [127];
  }else {
    return [58];
  }
}
function getLabelForDigitalCourseByProfileURl(profileUrl: string): string {
  if(profileUrl === 'clink-learners'){
    return 'Graduate learning';
  }else if(profileUrl === 'person-supported'){
    return 'Person supported learning';
  }
  return 'Participant learning';
}

function getFeatureIdForSystmInteraction(profileUrl: string): number[] {
  if(profileUrl === 'person-supported'){
     return [118];
   }else {
     return [98];
   }
 }
