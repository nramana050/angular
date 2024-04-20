import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ILearners } from 'src/app/features/learners/learners.interface';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { SessionsService } from 'src/app/sessions/sessions.service';
import { CaptrLearnersService } from '../../captr-learners.services';
import { LearnerNavigation } from '../learner-nav';

@Component({
  selector: 'app-view-further-information',
  templateUrl: './view-further-information.component.html',
  styleUrls: ['./view-further-information.component.scss']
})
export class ViewFurtherInformationComponent implements OnInit, OnDestroy {

  loggedInUserRole: number;
  user: ILearners;
  fname:string;
  refData;
  isLoaded: boolean = false;
  refAnswer: any;
  furtherInfo:any;
  isAuthorized = false;
 
  constructor(
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly sessionService: SessionsService,

  ) { 
        
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);

     this.setTitle();
      this.captrLearnersService.getRefAnswer().subscribe(data => {
        this.refAnswer = data;
        this.refAnswer = this.refAnswer.filter(ref => ref.identifier !== 'PNS')
  
      })
  }

  ngOnInit(): void {
    this.loggedInUserRole = this.captrLearnersService.resolveLoggedInUserRole();
    this.isAuthorized = this.sessionService.hasResource(['9','3']);
    this.resolveUser();
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
      }
      this.route.snapshot.data['title'] = `${this.fname}`;
    });
  }

  resolveUser() {
    this.getUserRefDataDetails1();
    this.route.queryParams.subscribe((params: any) => {
      const id = params.id;
      this.captrLearnersService.getUserDetails(id).subscribe(userDetails => {
        this.user = userDetails;
        this.isLoaded = true;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
      this.captrLearnersService.getFurtherInfo(id).subscribe(userDetails => {
        this.furtherInfo=userDetails;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
  }

  getUserRefDataDetails1() {
    this.captrLearnersService.getFurtherInfoRefData().subscribe(data => {
      this.refData = data;
      console.log(this.refData);
      
    });
  }

  isAuthorize(fid) {
    return this.sessionService.hasResource([fid.toString()])
  }

  Authorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }
  
}
