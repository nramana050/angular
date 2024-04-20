import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IAssessmentTemplate } from '../../../../features/assessment/assessment.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InPageNavService } from '../../../../framework/components/in-page-nav/in-page-nav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';
import { LearnerNavigation } from '../learner-nav';
import { PerformanceReviewService } from './performance-review.service';
import { CaptrLearnersService } from '../../captr-learners.services';
import { MentivityLearnerNavigation } from 'src/app/features/mentivity-learners/view-mentivity-learners/mentivity-learner-nav';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-performance-review',
  templateUrl: './performance-review.component.html',
  styleUrls: ['./performance-review.component.scss']
})
export class PerformanceReviewComponent implements OnInit, OnDestroy {

  sortColumn = 'assessmentName';
  sortDirection = 'asc';
  pageSize = 10;
  filterBy = { 'keyword': '' };

  displayedColumns: string[] = ['assessmentName', 'createdDate', 'modifiedDate', 'status', 'managerStatus', 'actions'];
  dataSource = new MatTableDataSource<IAssessmentTemplate>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  fname: any;
  userId: any;
  allAssessments: any[] = [];
  status;
  todoTab;
  completedTab;
  allTab;
  assessId: number;
  staffIsPartiallyCompleted: boolean;
  staffIsCompleted: boolean;
  profileUrl;


  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly reviewsService: PerformanceReviewService,
    private readonly snackBarService: SnackBarService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly captrLearnersService: CaptrLearnersService,

  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
       this.setTitle();
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
  }

  setTitle() {
    this._route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
        this.userId = params.id;
      }
      this._route.snapshot.data['title'] = `${this.fname}`;
    });
  }

  ngOnInit(): void {
    this.getAllAssessments();
  }

  getAllAssessments() {
    this.assessId = 17;
    this.reviewsService.getAllAssessmentByUserAndAssessId(this.userId, this.assessId).subscribe(
      response => {
        this.paginator.pageIndex = 0;
        this.allAssessments = response;
        this.dataSource.data = this.allAssessments;
        this.paginator.length = response.length;
        this.dataSource.paginator = this.paginator;
      },
      error => this.snackBarService.error(error.errorMessage)
    );
  }

  onExitClicked() {
    this._router.navigate([this.profileUrl+'/participant-professional-view'],  { queryParamsHandling :"merge" , queryParams: { id: this.userId, name: this.fname }});
  }


  onViewClicked(element){
    this.setStaffFlags(element);
    this._router.navigate([this.profileUrl+'/performance-review/view'],  { queryParamsHandling :"merge" ,queryParams: { id : this.userId, name:this.fname, assessmentTemplateId: element.assessmentTemplateId, assessmentTemplateUserId: element.assessmentTemplateUserId, isPartiallyCompleted: element.isPartiallyCompleted, isCompleted:element.isCompleted, isStaffPartiallyCompleted: this.staffIsPartiallyCompleted, isStaffCompleted: this.staffIsCompleted }});
  }

  onEditClicked(element) {
    this.setStaffFlags(element);
    this._router.navigate([this.profileUrl+'/performance-review/edit'],  { queryParamsHandling :"merge" , queryParams: { id : this.userId, name:this.fname, assessmentTemplateId: element.assessmentTemplateId, assessmentTemplateUserId: element.assessmentTemplateUserId, isPartiallyCompleted: element.isPartiallyCompleted, isCompleted:element.isCompleted, isStaffPartiallyCompleted: this.staffIsPartiallyCompleted, isStaffCompleted: this.staffIsCompleted }});
  }

  setStaffFlags(element){
    if(element.staffIsPartiallyCompleted ==null){
      this.staffIsPartiallyCompleted = false
    } else{
      this.staffIsPartiallyCompleted = element.staffIsPartiallyCompleted;
    }
    if(element.staffIsCompleted ==null){
      this.staffIsCompleted = false;
    } else{
      this.staffIsCompleted = element.staffIsCompleted;
    }
  }
}
