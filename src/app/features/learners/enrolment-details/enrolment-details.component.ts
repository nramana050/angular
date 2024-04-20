import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { LearnersService } from '../learners.services';
import { EditLeanerSteps } from '../add-learner/edit-learner.steps';
import { IEnrolmentDetails } from './enrolment-details.interface';

@Component({
  selector: 'app-enrolment-details',
  templateUrl: './enrolment-details.component.html',
  styleUrls: ['./enrolment-details.component.scss']
})
export class EnrolmentDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  dataSource: any = new MatTableDataSource<IEnrolmentDetails>();
  displayedColumns: string[] = ['programmeName', 'cohort', 'startdate', 'endDate', 'status', 'actions'];
  pageSize = 10;
  filterBy = { 'keyword': '', 'refUserType': 'SU', appId: localStorage.getItem('ApplicationID') };
  sortColumn = 'fullName';
  sortDirection = 'asc';
  fullName: any;
  currentDate = new Date();
  isCompleted: boolean = false;
  did: any
  id: any;
  programmeStatus: any;
  pName:any;
  refData:any;
  isView: boolean =false;
  actionOperation;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private readonly learnersService: LearnersService,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly editLeanerSteps: EditLeanerSteps,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly datepipe: DatePipe,
    private readonly router: Router,
  ) {
    this.stepperNavigationService.stepper(this.editLeanerSteps.stepsConfig);
    this.learnersService.getRefData().subscribe(data => {
      this.refData = data;

    })
  }

  ngOnInit(): void {
    this.stepperNavigationService.stepper(this.editLeanerSteps.stepsConfig);
    this.resolveUser();
  }

  ngOnDestroy() {
    this.stepperNavigationService.stepper(null);
  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(data => {
      this.sortColumn = data.active;
      this.sortDirection = data.direction;
      this.paginator.pageIndex = 0;
    });
  }

  resolveUser() {
    this.route.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.fullName = params.name;
      this.actionOperation = params.operation;
      this.learnersService.getEnrolmentDetails(this.id).subscribe(enrolmentDetails => {
        this.dataSource = enrolmentDetails;
        this.did = enrolmentDetails[0].programmeDeliveryId;
        let date;
        date = this.datepipe.transform(this.currentDate, 'yyyy-MM-dd');
        this.dataSource.forEach(function (value) {
          if(value.statusId!==null){
            value.status=value.statusId;
          }
          if (value.startdate > (date) && value.endDate > date && value.statusId === null) {
            value.status = "Not Yet Started";
            value.statusId=3
          }
          if (value.startdate <= date && value.statusId === null) {
            value.status = "In Progress";
            value.statusId=1
          }
          if (value.statusId ===2) {
            value.status = "Withdrawn";
          }
        });
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
    })
  }

  navigateToEditEnrolment(index) {
    this.did = this.dataSource[index].programmeDeliveryId;
    this.pName=this.dataSource[index].programmeName;
    this.programmeStatus = this.dataSource[index].status;
    this.router.navigate(['learners/enrolment-details/edit-enrolment'], { queryParamsHandling: 'merge', queryParams: { id: this.id, name: this.fullName, did: this.did, status: this.programmeStatus ,pName:this.pName} });
  }
  navigateToViewEnrolment(index) {
    this.did = this.dataSource[index].programmeDeliveryId;
    this.pName=this.dataSource[index].programmeName;
    this.programmeStatus = this.dataSource[index].status;
    this.router.navigate(['learners/enrolment-details/view-enrolment-details'], { queryParamsHandling: 'merge', queryParams: {id: this.id, name: this.fullName, did: this.did, status: this.programmeStatus ,pName:this.pName} });
  }
}
