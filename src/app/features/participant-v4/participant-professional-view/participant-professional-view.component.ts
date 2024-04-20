import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageUsersService } from '../../manage-users/manage-users.service';
import { SessionsService } from '../../shared/services/sessions.service';
import { ParticipantV4Service } from '../participant-v4.service';


@Component({
  selector: 'app-participant-professional-view',
  templateUrl: './participant-professional-view.component.html',
  styleUrls: ['./participant-professional-view.component.scss']
})
export class ParticipantProfessionalViewComponent implements OnInit {
   
    url;
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
    priorityAreaList: any;
    learnerDetail: any;
    workerDetail:any;
    sortColumn = 'noteTimestamp';
    sortDirection = 'desc';
    filterByCase = { 'keyword': '', 'userId': '', 'genericId': null };
    showProfessionView: boolean;
  
    //do not change this feature id
    readonly PROFESSIONAL_VIEW_FID = 61
  
    constructor(
      private readonly router: Router,
      private readonly route: ActivatedRoute,
      private readonly manageUsersService: ManageUsersService,
      private readonly sessionService: SessionsService,
      private readonly participantV4Service: ParticipantV4Service,
     
  
    ) { 
      this.url = this.route.snapshot['_routerState'].url.split("/", 2)[1];
    }
  
    ngOnInit(): void {
      this.showProfessionView = this.sessionService.hasResource([this.PROFESSIONAL_VIEW_FID.toString()])
      this.setTitle();
      this.route.queryParams.subscribe((params: any) => {
        if (params.id) {
          this.participantV4Service.getUserDetails(params.id).subscribe(res => {
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
        }
        if (params.hasOwnProperty('id')) {
          this.serviceUserId = +params['id'];
        }
        this.route.snapshot.data['title'] = `${this.fname}`;
      });
    }
  
    navigateOnStatus(){
      this.router.navigate([`${this.url}/profile`], { queryParams: { id: this.suId, name: this.fname}, queryParamsHandling: 'merge' });
    }
  
  
    getWorkerDetail(id) {
      this.manageUsersService.getUserDetails(id).subscribe(data=>{
        this.workerDetail = data;
      })
    }
  
  
  }
  