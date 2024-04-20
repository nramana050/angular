import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {  MatSort } from '@angular/material/sort';
import {  MatTableDataSource } from '@angular/material/table';
import {  MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '../../framework/components/app-confirm/app-confirm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AssessmentService } from './assessment.service';
import { IAssessmentTemplate } from './assessment.interface';
import { SnackBarService } from '../../framework/service/snack-bar.service';
import { tap } from 'rxjs/operators';
import { ReportsService } from '../reporting/reports/reports.service';
import { duration } from 'moment';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})

export class AssessmentComponent implements OnInit, AfterViewInit {
  public items: any[];
  
  sortColumn = 'assessmentName';
  sortDirection = 'asc';
  pageSize = 10;
  filterBy = { 'keyword': '' };

  public showTextField: boolean;
  public isActiveObject: object;
  publishToAll = true;
  authenticatedUserOrgId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).orgId;

  displayedColumns: string[] = ['assessmentName', 'createdBy', 'createdDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<IAssessmentTemplate>();
  configuredAssessmentNames:any;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:false}) sort: MatSort;
  public isEnableObject: Object;


  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly _assessmentService: AssessmentService,
    private readonly _onDeleteConfirmService: AppConfirmService,
    private readonly snackBarService: SnackBarService,
    private readonly snack: MatSnackBar,
    private readonly reportService:ReportsService
      
    ) { }
  fetchConfiguredAssessmentList(){
    this._assessmentService.fetchConfiguredAssessmentList().subscribe(data=>{
      this.configuredAssessmentNames  = data;
    })
  }
  resolveAssessments(filterBy) {
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }
    this._assessmentService
      .getAssessments(`${this.sortColumn},${this.sortDirection}`, this.pageSize, currentPageIndex, filterBy)
      .subscribe(data => {
        this.dataSource.data = data.content;
        this.dataSource.data.forEach(item => {
          item.actionsDisabled = this.hasActions(item.userId);
        });
        this.paginator.length = data.totalElements;
      }
      ,
        error => {
          this.snackBarService.error(`${error.error.applicationMessage}`);
          this.router.navigate(['./assessment-builder']);
        }
      );
  }

  onEditClicked(id): void {
        this._assessmentService.isCompletedAssessment(id).subscribe(
      (data: any) => {
        if (data) {
          this.snackBarService.success('Asset is completed by service user!');
        } else {
          this.router.navigate(['./edit-assessment/' + id], {relativeTo: this.route});
        }
      },
      (error: any) => {
        this.snackBarService.error(error.error.errorMessage);
      }
    );

  }

  onActiveClicked(id, state): void {
    const index: number = this.dataSource.data.map(el => el.assessmentTemplateId).indexOf(id);
    let status;
    state ? status = 'Inactive' : status = 'Active';

    const dialogRef = this._onDeleteConfirmService.confirm({
      title: `Confirm Status Change to ${status}`,
      message: `Are you sure you want to change status to ${state} for
       ${this.dataSource.data[index].assessmentName} template?`,
      showTextField: state,
      placeholderTextField: 'Reason for deactivation: '
    });

    dialogRef.subscribe(result => {
      if (result) {
        this.isActiveObject = new Object(
          { assessmentTemplateId: id, isActive: !state, archiveReason: result, userName: localStorage.getItem('username') }
        );
        this.updateActivationStatus(index, this.isActiveObject);
      }
    });
  }

  updateActivationStatus(index, isActiveObject) {
    this._assessmentService.activeAndInactiveAssessment(isActiveObject).subscribe(
      (data: IAssessmentTemplate) => {
        this.snackBarService.success('Asset Template Updated Successfully');
        this.dataSource.data[index].isActive = data.isActive;
        this.dataSource.data[index].status = this._assessmentService.setStatus(data.isActive, data.isPublished);
      },
      error => this.snackBarService.error(error.errorMessage)
    );
  }

  
  onFilter(filterValue: string) {
    this.filterBy.keyword = filterValue;
    this.paginator.pageIndex = 0;
    this.resolveAssessments(this.filterBy);

  }
  onPaginateChange(event) {
    document.querySelector('#assessments').scrollIntoView();
  }

  ngOnInit() {
    this.fetchConfiguredAssessmentList();
    this.resolveAssessments(this.filterBy);
  }

  ngAfterViewInit() {
   
    this.sort.sortChange.subscribe(data => {
      this.sortColumn = data.active;
      this.sortDirection = data.direction;
      this.paginator.pageIndex = 0;
      this.resolveAssessments(this.filterBy);
    });

    this.paginator.page
      .pipe(
        tap(() => {
          this.resolveAssessments(this.filterBy);
          document.querySelector('#assessments').scrollIntoView();
        }
        )
      )
      .subscribe();
  }
  hasActions(userRole) {

    if (this.authenticatedUserOrgId === 1 && userRole !== 5) {
      return false;
    }

    if (userRole === 5) { // temporary disable actions on service users
      return true;
    }

    if (this.authenticatedUserOrgId < userRole) {
      return false;
    } else {
      return true;
    }
  }

  onEnableClicked(id, state) :void  {
    const index: number = this.dataSource.data.map(el => el.assessmentTemplateId).indexOf(id);
    let status;
    state ? status = 'disable' : status = 'enable';

    const dialogRef = this._onDeleteConfirmService.confirm({
      message: `Are you sure you want to ${status} this asset for reporting?`
    });

    dialogRef.subscribe(result => {
      if (result) {
        this.isEnableObject = new Object(
          { assessmentTemplateId: id, isEnable: !state }
        );
        this.updateEnableStatus(index, this.isEnableObject);
      }
    });
  
}
  updateEnableStatus(index, isEnableObject) {
    this._assessmentService.enableAndDisableAssessment(isEnableObject).subscribe(
      (data: IAssessmentTemplate) => {
        this.snackBarService.success('Asset Template Updated Successfully');
        this.dataSource.data[index].enableReporting = data.enableReporting;
      },
      error => this.snackBarService.error(error.error.errorMessage)
    );
  }

  onExtractReport(assessmentName: any) {
    const clientIdentifier = this.getClientIdentifier();
    this.reportService.fabReport(assessmentName,clientIdentifier).subscribe(response => {
      if (response.status === 204) {
        this.snackBarService.error("Report not found");
      } else {
        let binaryData = [];
        binaryData.push(response.body);
        let responseFileName: string = this.getResponseFileName(response, assessmentName);
        let extractLink = document.createElement('a');
        extractLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: response.headers.get('Content-Type') }));
        extractLink.setAttribute('download', responseFileName);
        document.body.appendChild(extractLink);
        extractLink.click();
        extractLink.remove();
      }
    }, error => this.snackBarService.error(error.error.applicationMessage));
  }

  getResponseFileName(response: HttpResponse<Blob>, defaultName: string) {
    let fileName: string;
    try {
      const contentDisposition: string = response.headers.get('Content-Disposition');
      const pattern = /(?:filename="?)(.+)(?:"?)/
      fileName = pattern.exec(contentDisposition)[1];
    }
    catch (err) {
      fileName = defaultName + '.csv';
    }
    return fileName
  }

  getClientIdentifier() {
    if (localStorage.getItem('clientId') === '4') {
      return 'CAPTR';
    } else if (localStorage.getItem('clientId') === '104') {
      return 'EUCIC';
    }
  }
}
