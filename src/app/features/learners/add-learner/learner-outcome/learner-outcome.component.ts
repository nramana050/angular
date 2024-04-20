import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { LearnerOutcomeDetails } from './learner-outcome.interface';
import { LearnersService } from '../../learners.services';
import { EditLeanerSteps } from '../edit-learner.steps';
import { EditCaptrLeanerSteps } from 'src/app/features/captr-learners/add-captr-learner/edit-captr-learner.steps';
import { LearnersOutcomeService } from './learner-outcome-service';
import { EditMentivityLeanerSteps } from 'src/app/features/mentivity-learners/add-mentivity-learners/edit-mentivity-learner.steps';

@Component({
  selector: 'app-learner-outcome',
  templateUrl: './learner-outcome.component.html',
  styleUrls: ['./learner-outcome.component.scss']
})
export class LearnerOutcomeComponent implements OnInit {

  dataSource: any = new MatTableDataSource<LearnerOutcomeDetails>();
  displayedColumns: string[] = ['programmeName', 'cohort', 'totalContacts', 'currentlyEmployed', 'lastContactDate', 'actions'];
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
  url;
  readonly CAPTR_URL = 'captr-learner';
  readonly MNVTY_URL = 'mentivity-learner';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private readonly learnersOutcomeService: LearnersOutcomeService,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly editLeanerSteps: EditLeanerSteps,
    private readonly editCaptrLeanerSteps: EditCaptrLeanerSteps,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly datepipe: DatePipe,
    private readonly router: Router,
    private readonly editMentivityLeanerSteps: EditMentivityLeanerSteps
  ) {
    this.url = this.route.snapshot['_routerState'].url.split("/", 2)[1];
    if(this.url === this.CAPTR_URL){
      this.stepperNavigationService.stepper(this.editCaptrLeanerSteps.stepsConfig);
    }else if(this.url === this.MNVTY_URL){
      this.stepperNavigationService.stepper(this.editMentivityLeanerSteps.stepsConfig);
    }
    else{
      this.stepperNavigationService.stepper(this.editLeanerSteps.stepsConfig);
    }
  }

  

  ngOnInit(): void {
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
      this.learnersOutcomeService.getAllOutcomeDataOfUser(this.id).subscribe(outcomeDetails => {
        this.dataSource = outcomeDetails;
        });
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      })
    
  }

  navigateToEditEnrolment(index) {
    this.did = this.dataSource[index].programmeDeliveryId;
    this.pName=this.dataSource[index].programmeName;
    this.programmeStatus = this.dataSource[index].status;
    this.router.navigate(['outcome-list'], { relativeTo:this.route, queryParamsHandling: 'merge', queryParams: { id: this.id, name: this.fullName, did: this.did, status: this.programmeStatus ,pName:this.pName} });
  }
}
