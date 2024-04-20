import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EditCaptrLeanerSteps } from 'src/app/features/captr-learners/add-captr-learner/edit-captr-learner.steps';
import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { LearnersService } from '../../../learners.services';
import { EditLeanerSteps } from '../../edit-learner.steps';
import { LearnersOutcomeService } from '../learner-outcome-service';
import { OutcomeListDetails } from './outcome-list.interface';

@Component({
  selector: 'app-outcome-list',
  templateUrl: './outcome-list.component.html',
  styleUrls: ['./outcome-list.component.scss']
})
export class OutcomeListComponent implements OnInit {
  dataSource: any = new MatTableDataSource<OutcomeListDetails>();
  displayedColumns: string[] = ['ContactDate', 'Successful', 'Employed', 'Outcome', 'actions'];
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
  pName: any;
  refData: any;
  programmeDeliveryId;
  outcomeId;
  actionOperation:any;
  url;
  readonly CAPTR_URL = 'captr-learner';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private readonly learnersOutcomeService: LearnersOutcomeService,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly editLeanerSteps: EditLeanerSteps,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly datepipe: DatePipe,
    private readonly router: Router,
    private readonly appConfirmService: AppConfirmService,
    private readonly editCaptrLeanerSteps: EditCaptrLeanerSteps
  ) {
    this.url = this.route.snapshot['_routerState'].url.split("/", 2)[1];
    if(this.url === this.CAPTR_URL){
      this.stepperNavigationService.stepper(this.editCaptrLeanerSteps.stepsConfig);
    }
    else{
      this.stepperNavigationService.stepper(this.editLeanerSteps.stepsConfig);
    }
  }

  ngOnInit(): void {
    this.learnersOutcomeService.getUserRefData().subscribe(data => {
      this.refData = data;
      this.resolveUser();
    });
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
      this.programmeDeliveryId = params.did;
      this.actionOperation = params.operation;
      this.learnersOutcomeService.getUserOutcomeDataOnDelivery(this.programmeDeliveryId, this.id).subscribe(outcomeDetails => {
        this.dataSource = outcomeDetails;
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
    });
  }

  navigateToEditOutcome(index) {
    this.outcomeId = this.dataSource[index].id;
    this.did = this.dataSource[index].programmeDeliveryId;
    this.pName = this.dataSource[index].programmeName;
    this.programmeStatus = this.dataSource[index].status;
    this.router.navigate(['edit-outcome'], { relativeTo: this.route, queryParamsHandling: 'merge', queryParams: { id: this.id, name: this.fullName, did: this.did, oId: this.outcomeId } });
  }
  navigateToViewoutcome(index){
    this.outcomeId = this.dataSource[index].id;
    this.did = this.dataSource[index].programmeDeliveryId;
    this.pName = this.dataSource[index].programmeName;
    this.programmeStatus = this.dataSource[index].status;
    this.router.navigate(['view-outcome-list'], { relativeTo: this.route, queryParamsHandling: 'merge', queryParams: { id: this.id, name: this.fullName, did: this.did, oId: this.outcomeId } });

  }

  deleteOutcome(index){
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete outcome`,
      message: `Are you sure you want to delete outcome?`
    });
    dialogRef.subscribe(result => {
      if (result) {
    this.outcomeId = this.dataSource[index].id;
    this.learnersOutcomeService.deletLearnerOutcomeData(this.outcomeId).subscribe((resp) => {
      this.router.navigate(['../'],{relativeTo: this.route, queryParamsHandling: 'merge'});
      this.snackBarService.success("Outcome deleted successfully");
    });
  }
});
}
  
}