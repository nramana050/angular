import { Injectable } from '@angular/core';

const reportingRoute = 'dashboard';

@Injectable()
export class ReportsNavigation {

  reportsInPageMenu = {

    sectionName: 'Dashboard',
    featureId: [42],
    description: ``,
    state: null,
    icon: 'bar_chart',
    menuItems: [
      {
        name: 'Dashboards',
        featureId: [42],
        description: ``,
        state: null,
        icon: null,
        submenu: [

          {
            name: 'Report 1',
            featureId: [92],
            description: ``,
            state: `${reportingRoute}/report1`,
            icon: null
          },
          {
            name: 'Report 2',
            featureId: [92],
            description: ``,
            state: `${reportingRoute}/report2`,
            icon: null
          },
          {
            name: 'Report 3',
            featureId: [92],
            description: ``,
            state: `${reportingRoute}/contracts1`,
            icon: null
          },
          {
            name: 'Report 4',
            featureId: [92],
            description: ``,
            state: `${reportingRoute}/contracts2`,
            icon: null
          },
          {
            name: 'Report 5',
            featureId: [92],
            description: ``,
            state: `${reportingRoute}/pes-dashboard`,
            icon: null
          },
          {
            name: 'Report 6',
            featureId: [92],
            description: ``,
            state: `${reportingRoute}/wales-estate-dashboards`,
            icon: null
          },
          {
            name: 'MI Data',
            featureId: [91],
            description: ``,
            state: `${reportingRoute}/mi-data`,
            icon: null
          },
          {
            name: 'Raw Data',
            featureId: [90],
            description: ``,
            state: `${reportingRoute}/raw-data`,
            icon: null
          },

        ]
      },

      {
        name: 'Data Extract',
        featureId: [92],
        description: ``,
        state: `${reportingRoute}/data-extract`,
        icon: null,
        submenu: []
      },
      
    ]
  };
}
