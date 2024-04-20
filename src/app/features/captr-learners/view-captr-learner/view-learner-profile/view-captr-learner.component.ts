import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ILearners } from 'src/app/features/learners/learners.interface';
import { MentivityLearnerNavigation } from 'src/app/features/mentivity-learners/view-mentivity-learners/mentivity-learner-nav';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { CaptrLearnersService } from '../../captr-learners.services';
import { LearnerNavigation } from '../learner-nav';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';

@Component({
  selector: 'app-view-captr-learner',
  templateUrl: './view-captr-learner.component.html',
  styleUrls: ['./view-captr-learner.component.scss']
})
export class ViewCaptrLearnerComponent implements OnInit,OnDestroy {

  loggedInUserRole: number;
  user: ILearners;
  fname:string;
  refData;
  isLoaded: boolean = false;
  userList;
  isAuthorized = false;
  url;
  readonly MNVTY_URL = 'mentivity-learner';
  workerDetail: any;


  constructor(
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly manageUsersService: ManageUsersService,
    private readonly sessionService: SessionsService,
  ) { 
      this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
      this.setTitle();
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
    this.isAuthorized = false;
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
      }
      this.route.snapshot.data['title'] = `${this.fname}`;
    });
  }

  ngOnInit(): void {
    this.loggedInUserRole = this.captrLearnersService.resolveLoggedInUserRole();
    this.isAuthorized = this.sessionService.hasResource(['9','3']);
    this.resolveUser();
  }

  resolveUser() {
    this.getUserRefDataDetails1();
    this.route.queryParams.subscribe((params: any) => {
      const id = params.id;
      this.captrLearnersService.getUserDetails(id).subscribe(userDetails => {
        this.user = userDetails;
        this.getWorkerDetail(userDetails.primaryLearnerDetails.workerId)
        this.isLoaded = true;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
  }

  getWorkerDetail(id) {
    this.manageUsersService.getUserDetails(id).subscribe(data=>{
      this.workerDetail = data;
      Object.assign(this.workerDetail, { fullName: data.firstName + ' ' + data.lastName });
    })
  }

  getUserRefDataDetails1() {
    this.captrLearnersService.getUserRefDataDetails().subscribe(data => {
      this.refData = data;
    });
  }

  isAuthorize(fid) {
    return this.sessionService.hasResource([fid.toString()])
  }

}
