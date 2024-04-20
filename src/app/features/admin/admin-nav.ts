import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Injectable()
export class AdminNavigation {

  constructor( private readonly route: ActivatedRoute) {
  
    // to-do
   
  }

  adminRoute = this.route.snapshot['_routerState'].url.split("/", 2)[1];

  adminSubMenu = {

    sectionName: 'Course Management',
    featureId: [59],
    description: ``,
    state: null,
    icon: 'bar_chart',
    menuItems: [
      // {
      //   name: 'Resource setup',
      //   featureId: [50],
      //   description: ``,
      //   state: `${this.adminRoute}/resource-setup`,
      //   icon: null,
      //   submenu: []
      // },
      {
        name: 'Provider setup',
        featureId: [59],
        description: ``,
        state: `${this.adminRoute}/provider-setup`,
        icon: null,
        submenu: []
      },
      {
        name: 'Course setup',
        featureId: [59],
        description: ``,
        state: `${this.adminRoute}/course-setup`,
        icon: null,
        submenu: []
      },
      {
        name: 'Qualification setup',
        featureId: [59],
        description: ``,
        state: `${this.adminRoute}/qualification-setup`,
        icon: null,
        submenu: []
      }
    ]
  };
}
