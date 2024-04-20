import { Component, OnInit, ViewChild } from '@angular/core';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../../learner-nav';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { ProgrammeOutcomesService } from '../programme-outcomes.service';
import { IProgrammeOutcomesList } from './programme-outcomes-list.interface.';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-programme-outcomes-list',
  templateUrl: './programme-outcomes-list.component.html',
  styleUrls: ['./programme-outcomes-list.component.scss']
})
export class ProgrammeOutcomesListComponent implements OnInit {
  userId: any;
  dataSource: any = new MatTableDataSource<IProgrammeOutcomesList>();
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
  profileUrl;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly route: ActivatedRoute,
    private readonly programmeOutcomesService: ProgrammeOutcomesService,
    private readonly snackBarService: SnackBarService,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly datepipe: DatePipe,
    private readonly router: Router,
    private readonly appConfirmService: AppConfirmService,

    ) {
      this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
      this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
      this.setTitle();
     }

     ngOnInit(): void {
      this.programmeOutcomesService.getUserRefData().subscribe(data => {
        this.refData = data;
        this.resolveUser();
      });
    }
  
    setTitle() {
      this.route.queryParams.subscribe((params: any) => {
        this.userId = params.id;
        this.route.snapshot.data.title = `${params.name}`;
      });
    }
  
    ngOnDestroy() {
      this.inPageNavService.setNavItems(null);
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
        this.fullName = params.name
        this.programmeOutcomesService.getUserOutcomeDataOnDelivery(this.programmeDeliveryId, this.id).subscribe(outcomeDetails => {
          this.dataSource = outcomeDetails;
        }, error => {
          this.snackBarService.error(error.error.applicationMessage);
        })
      });
    }
  
    navigateToViewoutcome(index){
      this.outcomeId = this.dataSource[index].id;
      this.did = this.dataSource[index].programmeDeliveryId;
      this.pName = this.dataSource[index].programmeName;
      this.programmeStatus = this.dataSource[index].status;      
      this.router.navigate(['view-programme-outcome'], { relativeTo: this.route, queryParamsHandling: 'merge', queryParams: { id: this.id, name: this.fullName, did: this.did, oId: this.outcomeId } });
  
    }
  
    deleteOutcome(index){
      const dialogRef = this.appConfirmService.confirm({
        title: `Delete outcome`,
        message: `Are you sure you want to delete outcome?`
      });
      dialogRef.subscribe(result => {
        if (result) {
      this.outcomeId = this.dataSource[index].id;
      this.programmeOutcomesService.deletLearnerOutcomeData(this.outcomeId).subscribe((resp) => {
        this.router.navigate(['../'],{relativeTo: this.route, queryParamsHandling: 'merge'});
        this.snackBarService.success("Outcome deleted successfully");
      });
    }
  });
  }

  goToDigitalCourse(){ 
    this.router.navigate([this.profileUrl+'/digital-course-progress'],  { queryParamsHandling :"merge"});
}

goToProgramInfo(){
  this.router.navigate([this.profileUrl+'/digital-course-progress/programme-enrolment'],  { queryParamsHandling :"merge"});
}
goToProgramOutcome(){
  this.router.navigate([this.profileUrl+'/digital-course-progress/programme-outcomes'],  { queryParamsHandling :"merge"});
}
  }