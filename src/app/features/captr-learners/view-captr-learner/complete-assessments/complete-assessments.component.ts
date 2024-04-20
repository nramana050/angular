import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CompleteAssessmentsService } from './complete-assessments.service';
import * as Survey from 'survey-angular';
import * as widgets from 'surveyjs-widgets';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../learner-nav';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { CaptrLearnersService } from '../../captr-learners.services';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

widgets.bootstrapslider(Survey);

@Component({
  selector: 'app-complete-assessments',
  templateUrl: './complete-assessments.component.html',
  styleUrls: ['./complete-assessments.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CompleteAssessmentsComponent implements OnInit, OnDestroy {
  fname: string;
  lname: string;
  prn: string;
  userId: string;
  displayedColumns: string[] = ['assessmentName', 'createdDate', 'modifiedDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();
  authenticatedUserId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userId;
  public pageSize = 10;
  allAssessments: any[] = [];
  status;
  todoTab;
  completedTab;
  allTab;
  profileUrl;
  tabName='Assessment';
  fristcolName="Assessment"
  seccolName= "Date Assigned";
  thirdcolName="Last Updated"
  fourthcolName="Status"
  fivthcolName="Action"

  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort , {static:false}) sort: MatSort;
  constructor(
    private readonly _completeAssessmentsService: CompleteAssessmentsService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly appConfirmService: AppConfirmService,
    private readonly sessionService: SessionsService,

  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);

    if (this.profileUrl === 'person-supported') {
      this.tabName = 'Quizzes';
      this.fristcolName = 'Quiz';
  } else {
      this.tabName = 'Assessment';
      this.fristcolName = 'Assessment';
  }
   


    this.setTitle();
  }

  setTitle() {
    this._route.snapshot.parent.data['title']= ''; 
    this._route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
        this.userId = params.id;
      }
      this._route.snapshot.data['title'] = `${this.fname}`;
    });
  }

  ngOnInit() {
   
    this._route.url.subscribe(url =>{
      this.setTitle();
    })
    this._route.queryParams.subscribe((params: any) => {
      this.paginator.pageSize = this.pageSize;
      this.userId = params.id;
    });
    this._route.params.subscribe((param: any) =>{
      if(param.status){
        this.status = param.status;
      }
      this.getAllAssessments();
    })
  }
  onExitClicked() {
    this._router.navigate([this.profileUrl+'/participant-professional-view'],  { queryParamsHandling :"merge"});
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  onDeleteClicked(id1,id2) {
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete Assessment`,
      message: `Are you sure you want to delete Assessment?`,
      okButtonName: 'Yes',
      cancelButtonName: 'No'
    });

    dialogRef.subscribe(result => {
      if (result) {
        this._completeAssessmentsService.deleteAssessment(id1,id2).subscribe(
          data => {
            this.getAllAssessments();
            this.snackBarService.success('Assessment deleted successfully!');
          },
          (error: any) => {
            this.snackBarService.error(error.errorMessage);
          }
        );
      }
    });
  }

getAllAssessments() {
    this._completeAssessmentsService.getAssessmentListByLoggedInUser(this.userId).subscribe(
      response => {
        this.allAssessments = response;
        if(this.status){
          this.filterAssessments(this.status);
        }else{
          this.filterAssessments('todo');
        }
        
        this.paginator.length = response.length;
        this.dataSource.paginator = this.paginator;
      },
      error => this.snackBarService.error(error.errorMessage)
    );
  }
filterAssessments(status) {
  this.status = status;
  this.paginator.pageIndex = 0;

  switch (status) {
    case 'completed':
      this.dataSource.data = this.allAssessments.filter(obj => obj.isCompleted === true);
      this.completedTab = true;
      this.todoTab = false;
      this.allTab = false;
      break;
    case 'todo': 
      this.dataSource.data = this.allAssessments.filter(obj => obj.isCompleted === false);
      this.completedTab = false;
      this.todoTab = true;
      this.allTab = false;

      break;
    default:
      this.dataSource.data = this.allAssessments;
      this.completedTab = false;
      this.todoTab = false;
      this.allTab = true;

      break;
  }
  this._router.navigate([],{ queryParams: {status:null}, queryParamsHandling: "merge"});
}

 isAuthorized(fid, opId) {
   return this.sessionService.hasResource([fid.toString(), opId.toString()])
 }
}
