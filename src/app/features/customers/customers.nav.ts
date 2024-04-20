import { Injectable } from '@angular/core';

const dataInputRoute = 'customers';

@Injectable()
export class CustomersNavigation {

    CustomersMenu = {

        sectionName: 'Customers',
        featureId: [15],
        description: ``,
        state: null,
        icon: 'person_outline',
        menuItems: [
            {
                name: 'Customers',
                featureId: [11],
                description: ``,
                state: `${dataInputRoute}`,
                icon: null,
                submenu: []
            },
            {
                name: 'Sync Data',
                featureId: [12],
                description: ``,
                state: null,
                icon: null,
                submenu: [
                  {
                    name: 'Content Sync Data',
                    featureId: [12],
                    description: 'Content Sync Data',
                    state: `${dataInputRoute}/content-sync-data`,
                    icon: null
                  },
                  {
                      name: 'Track Lite Sync Data',
                      featureId: [13],
                      description: 'Track Lite Sync Data',
                      state: `${dataInputRoute}/track-lite-sync-data`,
                      icon: null
                  },
                ]
            },
        ]
    };
}
