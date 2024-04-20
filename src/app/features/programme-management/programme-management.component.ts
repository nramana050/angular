import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InPageNavService } from '../../framework/components/in-page-nav/in-page-nav.service';
import { ProgrammeManagmentNavigation } from './programme-management-nav';

@Component({
  selector: 'app-programme-management-component',
  templateUrl: './programme-management.component.html'
})
export class ProgrammeManagementComponent implements OnInit,OnDestroy {

  constructor(private readonly route: ActivatedRoute,
    private readonly inPageNavService: InPageNavService,
    private readonly programmeManagmentNavigation: ProgrammeManagmentNavigation) 
    { }

  ngOnInit(){
    this.inPageNavService.setNavItems(this.programmeManagmentNavigation.programmeManagmentSubMenu);
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

}
