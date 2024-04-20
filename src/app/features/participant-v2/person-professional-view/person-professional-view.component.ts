import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantNavigation } from '../view-participant/participant-nav';
import { ParticipantV2Service } from '../participant-v2.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { SessionsService } from '../../shared/services/sessions.service';
import { ManageUsersService } from '../../manage-users/manage-users.service';

@Component({
  selector: 'app-person-professional-view',
  templateUrl: './person-professional-view.component.html',
  styleUrls: ['./person-professional-view.component.scss']
})
export class PersonProfessionalViewComponent implements OnInit {

  user;
  suId: any;
  fname: string;
  url;
  serviceUserId: number;
  prn: any;
  suStatus: any;
  showProfessionView: boolean;
  userList;
  readonly PROFESSIONAL_VIEW_FID = 61

  constructor(
    private readonly route: ActivatedRoute,
    private readonly participantLearnersService: ParticipantV2Service,
    private readonly snackBarService: SnackBarService,
    private readonly router: Router,
    private readonly sessionService: SessionsService,
    private readonly manageUsersService: ManageUsersService,
  ) { 
    this.url = this.route.snapshot['_routerState'].url.split("/", 2)[1];
    this.getUserRefDataDetails1();
  }

  ngOnInit(): void {
    this.resolveUser();
  }

  resolveUser() {
    
    this.showProfessionView = this.sessionService.hasResource([this.PROFESSIONAL_VIEW_FID.toString()])
      this.route.queryParams.subscribe((params: any) => {
        this.suId = params.id,
        this.fname = params.name;
      this.participantLearnersService.getUserDetails(params.id).subscribe(userDetails => {
        this.user = userDetails;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
  }

  getUserRefDataDetails1() {
    this.manageUsersService.getFilterUserList(21).subscribe(data => {
      data.forEach((users: any) => {
        Object.assign(users, { value: users.firstName + ' ' + users.lastName });
      });
      this.userList = data    
    })
  
}

  navigateOnStatus(){
    this.router.navigate([`${this.url}/profile`], { queryParams: { id: this.suId, name: this.fname}, queryParamsHandling: 'merge' });
  }
}
