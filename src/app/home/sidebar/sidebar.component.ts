import { Component, OnInit } from '@angular/core';
import { AppFeaturesService } from './AppFeatureService';
import { IAppFeatures } from '../sidebar/AppFeatures'


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {


  primaryMenu: IAppFeatures[] = [];
  constructor(
    private readonly appFeaturesService: AppFeaturesService) {

  }

  ngOnInit(): void {
    // this.appFeaturesService.getAppFeatures().subscribe((data: IAppFeatures[]) => {
    //   this.primaryMenu = data;
    // });
  }
  
}
