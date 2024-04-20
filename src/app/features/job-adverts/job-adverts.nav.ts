import { Injectable } from '@angular/core';

const dataInputRoute = 'job-advert';

@Injectable()
export class JobAdvertsNavigation {
    

    jobAdvertPageMenu = {

        sectionName: 'Job Adverts',
        featureId: [17],
        description: ``,
        state: null,
        icon: 'person_outline',
        menuItems: [
            {
                name: 'Jobs',
                featureId: [19],
                description: `Jobs`,
                state: `${dataInputRoute}/local-jobs`,
                icon: null,
                submenu: [
                ]
            },
            {
                name: 'Expressions of Interest',
                featureId: [19],
                description: `Jobs`,
                state: `${dataInputRoute}/expression-of-interest`,
                icon: null,
                submenu: [
                ]
            },
        ]
    };

}
