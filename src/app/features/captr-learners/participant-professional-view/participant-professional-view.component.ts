import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageUsersService } from '../../manage-users/manage-users.service';
import { SessionsService } from '../../shared/services/sessions.service';
import { CaptrLearnersService } from '../captr-learners.services';

@Component({
  selector: 'app-participant-professional-view',
  templateUrl: './participant-professional-view.component.html',
  styleUrls: ['./participant-professional-view.component.scss']
})
export class ParticipantProfessionalViewComponent implements OnInit {
  fname: string;
  lname: string;
  suId: any;
  serviceUserId: number;
  prn: any;
  panelOpenState = false;
  profileDetailsData: any;
  nDliususer: any = {};
  suStatus: any;
  hideCaseNote = false;
  roleId: any;
  showProfessionView: boolean;
  priorityAreaList: any;
  learnerDetail: any;
  workerDetail:any;
  sortColumn = 'noteTimestamp';
  sortDirection = 'desc';
  filterByCase = { 'keyword': '', 'userId': '', 'genericId': null };
  url;

  //do not change this feature id
  readonly PROFESSIONAL_VIEW_FID = 61

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly manageUsersService: ManageUsersService,
    private readonly captrUserService: CaptrLearnersService,
    private readonly sessionService: SessionsService

  ) { 
    this.url = this.route.snapshot['_routerState'].url.split("/", 2)[1];
  }

  ngOnInit(): void {
    this.showProfessionView = this.sessionService.hasResource([this.PROFESSIONAL_VIEW_FID.toString()])
    this.setTitle();
    this.route.queryParams.subscribe((params: any) => {
      this.suId = params.id
      if (params.id) {
        this.captrLearnersService.getUserDetails(params.id).subscribe(res => {
          this.learnerDetail = res;
          this.getWorkerDetail(this.learnerDetail.primaryLearnerDetails.workerId);
        })
      }
    });
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
        this.suId = params.id;
        this.prn = params.prn;
        this.suStatus = params.status
      }
      if (params.hasOwnProperty('id')) {
        this.serviceUserId = +params['id'];
      }
      this.route.snapshot.data['title'] = `${this.fname}`;
    });
  }

  navigateOnStatus() {
    if (this.suStatus === 'Inactive') {
      this.router.navigate([`${this.url}/view-learner-profile`], { relativeTo: this.route, queryParams: { id: this.suId, name: this.fname}, queryParamsHandling: 'merge' });
    
    }
    else {
      this.router.navigate([`${this.url}/profile`], { queryParams: { id: this.suId, name: this.fname}, queryParamsHandling: 'merge' });
    }
  }

  getWorkerDetail(id) {
    this.manageUsersService.getUserDetails(id).subscribe(data=>{
      this.workerDetail = data;
    })
  }
}
