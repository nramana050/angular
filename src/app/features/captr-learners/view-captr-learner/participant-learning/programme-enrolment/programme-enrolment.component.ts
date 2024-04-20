import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../learner-nav';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../../framework/service/snack-bar.service';
import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { CaptrLearnersService } from 'src/app/features/captr-learners/captr-learners.services';
import { IProgrammeEnrolment } from './programme-enrolment.interface';
import { SessionsService } from 'src/app/sessions/sessions.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-programme-enrolment',
  templateUrl: './programme-enrolment.component.html',
  styleUrls: ['./programme-enrolment.component.scss']
})
export class ProgrammeEnrolmentComponent implements OnInit {

  userId: any;
  dataSource: any = new MatTableDataSource<IProgrammeEnrolment>();
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
  profileUrl;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(  private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly route: ActivatedRoute,
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly snackBarService: SnackBarService,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly datepipe: DatePipe,
    private readonly router: Router,
    private readonly sessionService: SessionsService,
  ) {
   
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
      this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
      this.captrLearnersService.getRefData().subscribe(data => {
      this.refData = data;
    })

    this.setTitle();
  }

    ngOnInit(): void {
      this.resolveUser();
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
        this.fullName = params.name;
        this.actionOperation = params.operation;
        this.captrLearnersService.getEnrolmentDetails(this.id).subscribe(enrolmentDetails => {
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

    navigateToViewEnrolment(index) {
      this.did = this.dataSource[index].programmeDeliveryId;
      this.pName=this.dataSource[index].programmeName;
      this.programmeStatus = this.dataSource[index].status;
      this.router.navigate(['./viewProgram'], { relativeTo: this.route, queryParamsHandling: 'merge', queryParams: {id: this.id, name: this.fullName, did: this.did, status: this.programmeStatus ,pName:this.pName} });
    }

    isAuthorized(fid, opId) {
      return this.sessionService.hasResource([fid.toString(), opId.toString()])
    }

    onExitClicked() {
      this.router.navigate([this.profileUrl+'/participant-professional-view'],{ queryParamsHandling :"merge"});
    }

    goToDigitalCourse(){ 
      this.router.navigate([this.profileUrl+'/digital-course-progress'],{ queryParamsHandling :"merge"});
  }

  goToProgramInfo(){
    this.router.navigate([this.profileUrl+'/digital-course-progress/programme-enrolment'],{ queryParamsHandling :"merge"});
  }
  goToProgramOutcome(){
    this.router.navigate([this.profileUrl+'/digital-course-progress/programme-outcomes'],{ queryParamsHandling :"merge"});
  }
}
