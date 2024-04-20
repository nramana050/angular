import { Injectable } from '@angular/core';

const programmeDeliveryRoute = 'programme-management/programme-delivery';

@Injectable()
export class ViewProgrammeDeliveryNavigation {
  programmeDeliverySubMenu = {

    sectionName: 'Programme delivery',
    featureId: [50],
    description: ``,
    state: null,
    icon: 'bar_chart',
    menuItems: [
      {
        name: 'Delivery details',
        featureId: [50],
        description: ``,
        state: `${programmeDeliveryRoute}/view-pd`,
        icon: null,
        submenu: []
      },
      {
        name: 'Progress & Completion',
        featureId: [50],
        description: ``,
        state: `${programmeDeliveryRoute}/view-progress-completion`,
        icon: null,
        submenu: []
      },
      {
        name: 'Withdrawals',
        featureId: [50],
        description: ``,
        state: `${programmeDeliveryRoute}/view-withdrawals`,
        icon: null,
        submenu: []
      }
    ]
  };
}
