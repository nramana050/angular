import { Injectable } from '@angular/core';

const programmeManagementRoute = 'programme-management';

@Injectable()
export class ProgrammeManagmentNavigation {
    programmeManagmentSubMenu = {

    sectionName: 'Programme management',
    featureId: [50],
    description: ``,
    state: null,
    icon: 'bar_chart',
    menuItems: [
      {
        name: 'Programmes',
        featureId: [50],
        description: ``,
        state: `${programmeManagementRoute}/programmes`,
        icon: null,
        submenu: []
      },
      {
        name: 'Programme delivery',
        featureId: [50],
        description: ``,
        state: `${programmeManagementRoute}/programme-delivery`,
        icon: null,
        submenu: []
      }
    ]
  };
}
