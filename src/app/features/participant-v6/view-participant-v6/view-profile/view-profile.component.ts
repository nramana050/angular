import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';

import { ParticipantV6Service } from '../../participant-v6.service';
import { SessionsService } from '../../../shared/services/sessions.service';
import { LearnersService } from '../../../../features/learners/learners.services';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';
import { LearnerNavigation } from '../../../captr-learners/view-captr-learner/learner-nav';



@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {

  loggedInUserRole: number;
  user;
  fname:string;
  refData;
  isLoaded: boolean = false;
  userList;
  isAuthorized = false;
  url;
  allocatedRefData

  constructor(
    private readonly participantV6Service: ParticipantV6Service,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly learnerService: LearnersService,
    private readonly sessionService: SessionsService,
  ) {
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu3);
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
    this.loggedInUserRole = this.participantV6Service.resolveLoggedInUserRole();
    this.isAuthorized = this.sessionService.hasResource(['9','3']);
    this.participantV6Service.getAllocatedRefData().subscribe(data =>{
      this.allocatedRefData = data;
    });
    this.resolveUser();
  }

  resolveUser() {
    this.getUserRefDataDetails1();
    this.route.queryParams.subscribe((params: any) => {
      const id = params.id;
      this.participantV6Service.getUserDetails(id).subscribe(userDetails => {
        this.user = userDetails;
        this.isLoaded = true;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
  }

  getUserRefDataDetails1() {
    this.participantV6Service.getUserRefDataDetails().subscribe(data => {
      this.refData = data;
    });
    this.learnerService.getKwList(['RWHSA830','RWHSA3467' ]).subscribe((data: any) => {
      data.forEach((users: any) => {
        Object.assign(users, { value: users.firstName + ' ' + users.lastName });
      });
      this.userList = data
    });
  }

  isAuthorize(fid) {
    return this.sessionService.hasResource([fid.toString()])
  }
}
