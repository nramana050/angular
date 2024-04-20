import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Injectable()
export class ApplicationSetupNavigation {

  appSetupRoute = 'application-setup'

  appSetupSubMenu = {

    sectionName: 'Application-setup',
    featureId: [79],
    description: ``,
    state: null,
    icon: 'bar_chart',
    menuItems: [
      {
        name: 'Role creation',
        featureId: [80],
        description: ``,
        state: `${this.appSetupRoute}/role-creation`,
        icon: null,
        submenu: []
      },
      {
        name: 'Useful links',
        featureId: [125],
        description: ``,
        state: `${this.appSetupRoute}/tabs`,
        icon: null,
        submenu: []
      },
      {
        name: 'Organisation',
        featureId: [44],
        description: ``,
        state: `${this.appSetupRoute}/manage-organisations`,
        icon: null,
        submenu: []
      },
      {
        name: 'Licences',
        featureId: [79],
        description: ``,
        state: `${this.appSetupRoute}/licences`,
        icon: null,
        submenu: []
      }
    ]
  };
  appSetupSubMenu2= {

    sectionName: 'Application-setup',
    featureId: [79],
    description: ``,
    state: null,
    icon: 'bar_chart',
    menuItems: [
      {
        name: 'Role creation',
        featureId: [80],
        description: ``,
        state: `${this.appSetupRoute}/role-creation`,
        icon: null,
        submenu: []
      },
      {
        name: 'Useful links',
        featureId: [125],
        description: ``,
        state: `${this.appSetupRoute}/tabs`,
        icon: null,
        submenu: []
      },
 
      {
        name: 'Licences',
        featureId: [79],
        description: ``,
        state: `${this.appSetupRoute}/licences`,
        icon: null,
        submenu: []
      }, 
       {
        name: 'Programme set up',
        featureId: [153],
        description: ``,
        state: `${this.appSetupRoute}/programme`,
        icon: null,
        submenu: []
      }
    ]
  };
}
