import { Injectable } from '@angular/core';
import { IInPageMenuItem } from './administration.interface';

const dataInputRoute = 'administration';

@Injectable()
export class AdministrationNavigation {

    administrationPageMenu = {

        sectionName: 'Resource Setup',
        featureId: [15],
        description: ``,
        state: null,
        icon: 'person_outline',
        menuItems: [
                
                    {
                        name: 'Resource Categories',
                        featureId: [15],
                        description: 'Details about Resource Categories',
                        state: `${dataInputRoute}/content-category`,
                        icon: null,
                        submenu: []
                    },
                    {
                        name: 'Resource Keywords',
                        featureId: [15],
                        description: 'Details about Resource Keywords',
                        state: `${dataInputRoute}/content-keywords`,
                        icon: null,
                        submenu: []
                    },
                    {
                      name: 'Images',
                      featureId: [15],
                      description: 'Add Resource Images',
                      state: `${dataInputRoute}/content-image`,
                      icon: null,
                      submenu: []
                    }
                
            
        ]
    };

}
