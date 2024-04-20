import { Component, OnInit, ViewChild, Renderer2 } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProfileUrlIdentifier } from "src/app/framework/constants/PageTitleIdentifier-constants";
import { Utility } from "src/app/framework/utils/utility";
import { LearnerNavigation } from "../../captr-learners/view-captr-learner/learner-nav";
import { MatDialog } from "@angular/material/dialog";
import { AddPlanComponent } from "./add-plan/add-plan.component";
import { InPageNavService } from "src/app/framework/components/in-page-nav/in-page-nav.service";
import { MatTableDataSource } from "@angular/material/table";
import { PlanV2Service } from "./plan-v2.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { SessionsService } from "../../shared/services/sessions.service";
import { AddReviewComponent } from "./add-review/add-review.component";
import { SnackBarService } from "src/app/framework/service/snack-bar.service";
import { AppConfirmService } from "src/app/framework/components/app-confirm/app-confirm.service";

@Component({
  selector: 'app-plan-v2',
  templateUrl: './plan-v2.component.html',
  styleUrls: ['./plan-v2.component.scss']
})
export class PlanV2Component implements OnInit {
  profileUrl;
  fname: any;
  userId: number;
  assessmentTemplateId: any;
  assessmentName: any;
  displayedColumns: string[] = [
    "assessmentName",
    "createdDate",
    "modifiedDate",
    "status",
    "actions",
  ];
  dataSource = new MatTableDataSource<any>();
  assessmentTypeId = 22;
  filterBy = {
    keyword: null,
    assessmentTypeId: 22,
    page: 0,
    size: 10,
    userId: 1,
  };
  page = 0;
  size = 10;
  allAssessments: any[] = [];
  status:any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly dialog: MatDialog,
    private readonly sessionService: SessionsService,
    private readonly planV2Service: PlanV2Service,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly appConfirmService: AppConfirmService,
    private readonly renderer: Renderer2
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
        this.userId = +params.id;
        this.filterBy.userId = this.userId;
      }
      this._route.snapshot.data["title"] = `${this.fname}`;
    });
  }

  ngOnInit(): void {
    this.getassessmentes();
  }

  createPlan() {
    const dialogConfig = {
      data: {
        assessmentTemplateId: this.assessmentTemplateId,
        assessmentName: this.assessmentName,
      },
      autoFocus: false,
    };
    const dialogRef = this.dialog.open(AddPlanComponent,dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {});
  }
  
  getassessmentes() {
    this.planV2Service
      .getAssessmentListByLoggedInUser(this.filterBy, this.page, this.size)
      .subscribe((response) => {
        this.status = response.status;
        this.allAssessments = response.content;
        this.paginator.length = response.content.length;
        this.dataSource.data = response.content;
        this.paginator.length = response.totalElements;
      });
  }

  isAuthorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()]);
  }

  onExitClicked() {
    this._router.navigate(
      [this.profileUrl + "/participant-professional-view"],
      { queryParamsHandling: "merge" }
    );
  }
  navigateToEdit(assessmentTemplateId: string, assessmentType: string ,assessmentTemplateUserId:string,status:string): void {
    if(status == 'In progress') {
      this._router.navigate([`${this.profileUrl}/plan-v2/edit-plan`], {
        queryParamsHandling: 'merge',
        queryParams: {
          id: this.userId,
          tp_id: assessmentTemplateId,
          a_type: assessmentType,
          assessmentTemplateUserId: + assessmentTemplateUserId,
          status:status
        }
      });
      
    }else {
      const dialogConfig = {
        data: {
          assessmentTemplateId: + assessmentTemplateId,
          assessmentTemplateUserId: + assessmentTemplateUserId,
        },
        autoFocus: false,
      };
      const dialogRef = this.dialog.open(AddReviewComponent,dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {});
    }
  }
  goToPlan() {
    this.router.navigate([this.profileUrl + '/plan-v2'], { queryParamsHandling: 'merge' });
  }

  goToGoalsAndActions() {
    this.router.navigate([this.profileUrl + '/plan-v2/add-goals'], { queryParamsHandling: 'merge' });
  }

  onDeleteClicked(id1,id2) {
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete Plan`,
      message: `Are you sure you want to delete Plan?`,
      okButtonName: 'Yes',
      cancelButtonName: 'No'
    });

    dialogRef.subscribe(result => {
      if (result) {
        this.planV2Service.deleteAssessment(id1,id2).subscribe(
          data => {
            this.getassessmentes();
            this.snackBarService.success('Plan deleted successfully!');
          },
          (error: any) => {
            this.snackBarService.error(error.error.applicationMessage);
          }
        );
      }
    });
  }


  onPaginateChange(event) {
   this.page = event.pageIndex ;
   this.getassessmentes();
  }
  
  customuw() {
      this.renderer.addClass(document.body, 'uw-class');
  }
}
