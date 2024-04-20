import { Injectable } from '@angular/core';

const mentiviseRoute = 'mentivity-learner';

@Injectable()
export class MentivityLearnerNavigation {
  learnerSubMenu = {

    sectionName: 'User Profile',
    featureId: [99],
    description: ``,
    state: null,
    icon: 'bar_chart',
    menuItems: [
      {
        name: 'My Profile',
        featureId: [99],
        description: ``,
        state: `${mentiviseRoute}/view-profile`,
        icon: null,
        submenu: []
      },
      {
        name: 'My to do',
        featureId: [30],
        description: ``,
        state: `${mentiviseRoute}/plan`,
        icon: null,
        submenu: []
      },
      {
        name: 'Assessments',
        featureId: [31],
        description: ``,
        state: `${mentiviseRoute}/assessments`,
        icon: null,
        submenu: []
      },
      {
        name: "CVs",
        featureId: [32],
        description: ``,
        state: `${mentiviseRoute}/cv`,
        icon: null,
        submenu: []
      },
      {
        name: 'Documents',
        featureId: [33],
        description: ``,
        state: `${mentiviseRoute}/documents`,
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
        state: `${mentiviseRoute}/job-activity`,
        icon: null,
        submenu: []
      },
      {
        name: 'Useful Contacts',
        featureId: [77],
        description: ``,
        state: `${mentiviseRoute}/useful-contacts`,
        icon: null,
        submenu: []
      },
      {
        name: 'My Performance Review',
        featureId: [87],
        description: ``,
        state: `${mentiviseRoute}/performance-review`,
        icon: null,
        submenu: []
      },
      {
        name: 'Participant learning',
        featureId: [89],
        description: ``,
        state: `${mentiviseRoute}/digital-course-progress`,
        icon: null,
        submenu: []
      },
      {
        name: 'System interactions',
        featureId: [98],
        description: ``,
        state: `${mentiviseRoute}/system-interactions`,
        icon: null,
        submenu: []
      },
    ]
  };
  learnerSubMenu1 = {
    sectionName: 'Case note',
    featureId: [9],
    description: ``,
    state: null,
    icon: 'bar_chart',
    menuItems: [
      {
        name: 'Case Notes',
        featureId: [56],
        description: ``,
        state: `${mentiviseRoute}/case-note`,
        icon: null,
        submenu: []
      },
      {
        name: 'Professional Documents',
        featureId: [57],
        description: ``,
        state: `${mentiviseRoute}/professional-document`,
        icon: null,
        submenu: []
      },
      {
        name: 'Risk Assessment',
        featureId: [58],
        description: ``,
        state: `${mentiviseRoute}/risk-assessment`,
        icon: null,
        submenu: []
      },
      {
        name: 'Referrals',
        featureId: [58],
        description: ``,
        state: `${mentiviseRoute}/referral`,
        icon: null,
        submenu: []
      }
    ]
  };
  learnerSubMenu2 = {
    sectionName: 'User Profile',
    // featureId: [9],
    description: ``,
    state: null,
    icon: 'bar_chart',
    menuItems: [
      {
        name: 'My Profile',
        // featureId: [9],
        description: ``,
        state: `${mentiviseRoute}/view-profile`,
        icon: null,
        submenu: []
      },
      {
        name: 'My Performance Review',
        featureId: [87],
        description: ``,
        state: `${mentiviseRoute}/performance-review`,
        icon: null,
        submenu: []
      },
    ]
  }
}