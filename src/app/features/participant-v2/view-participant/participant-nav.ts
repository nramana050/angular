import { Injectable } from '@angular/core';

const learnerRoute = 'person-supported';

@Injectable()
export class ParticipantNavigation {
  learnerSubMenu = {

    sectionName: 'User Profile',
    featureId: [11],
    description: ``,
    state: null,
    icon: 'bar_chart',
    menuItems: [
      {
        name: 'My Profile',
        featureId: [9],
        description: ``,
        state: `${learnerRoute}/profile`,
        icon: null,
        submenu: []
      },
      {
        name: 'My to do',
        featureId: [30],
        description: ``,
        state: `${learnerRoute}/plan`,
        icon: null,
        submenu: []
      },
      {
        name: 'Assessments',
        featureId: [6],
        description: ``,
        state: `${learnerRoute}/assessments`,
        icon: null,
        submenu: []
      },
      {
        name: "CVs",
        featureId: [9],
        description: ``,
        state: `${learnerRoute}/cv`,
        icon: null,
        submenu: []
      },
      {
        name: 'Documents',
        featureId: [9],
        description: ``,
        state: `${learnerRoute}/documents`,
        icon: null,
        submenu: []
      },
      {
        name: 'Certificates',
        featureId: [120],
        description: ``,
        state: `${learnerRoute}/certificates`,
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
        featureId: [9],
        description: ``,
        state: `${learnerRoute}/job-activity`,
        icon: null,
        submenu: []
      },
      {
        name: 'Useful Contacts',
        featureId: [77],
        description: ``,
        state: `${learnerRoute}/useful-contacts`,
        icon: null,
        submenu: []
      },
      {
        name: 'Participant learning',
        featureId: [9],
        description: ``,
        state: `${learnerRoute}/digital-course-progress`,
        icon: null,
        submenu: []
      },
      {
        name: 'System interactions',
        featureId: [118],
        description: ``,
        state: `${learnerRoute}/system-interactions`,
        icon: null,
        submenu: []
      },

      {
        name: 'Staff comments',
        featureId: [119],
        description: ``,
        state: `${learnerRoute}/staff-comments`,
        icon: null,
        submenu: []
      },

      {
        name: 'System interactions',
        featureId: [118],
        description: ``,
        state: `${learnerRoute}/system-interactions`,
        icon: null,
        submenu: []
      },
    ]
  };
  learnerSubMenu1 = {
    sectionName: 'Case note',
    featureId: [11],
    description: ``,
    state: null,
    icon: 'bar_chart',
    menuItems: [
      {
        name: 'Case Notes',
        featureId: [9],
        description: ``,
        state: `${learnerRoute}/case-note`,
        icon: null,
        submenu: []
      },
      {
        name: 'Professional Documents',
        featureId: [57],
        description: ``,
        state: `${learnerRoute}/professional-document`,
        icon: null,
        submenu: []
      },
      {
        name: 'Risk Assessment',
        featureId: [58],
        description: ``,
        state: `${learnerRoute}/risk-assessment`,
        icon: null,
        submenu: []
      },
      {
        name: 'Referrals',
        featureId: [58],
        description: ``,
        state: `${learnerRoute}/referral`,
        icon: null,
        submenu: []
      },
      {
        name: 'Job Readiness',
        featureId: [101],
        description: ``,
        state: `${learnerRoute}/readiness`,
        icon: null,
        submenu: []
      }
    ]
  }
}
