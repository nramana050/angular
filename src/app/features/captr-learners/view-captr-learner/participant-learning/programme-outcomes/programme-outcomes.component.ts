import { Component, OnInit ,ViewChild} from '@angular/core';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../learner-nav';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { ProgrammeOutcomes } from './programme-outcomes.interface';
import { EditCaptrLeanerSteps } from 'src/app/features/captr-learners/add-captr-learner/edit-captr-learner.steps';
import { ProgrammeOutcomesService } from './programme-outcomes.service';
import { SessionsService } from 'src/app/sessions/sessions.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-programme-outcomes',
  templateUrl: './programme-outcomes.component.html',
  styleUrls: ['./programme-outcomes.component.scss']
})
export class ProgrammeOutcomesComponent implements OnInit {

  userId: any;
  dataSource: any = new MatTableDataSource<ProgrammeOutcomes>();
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
  profileUrl;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor( private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly route: ActivatedRoute,
    private readonly programmeOutcomesService: ProgrammeOutcomesService,
    private readonly snackBarService: SnackBarService,
    private readonly editCaptrLeanerSteps: EditCaptrLeanerSteps,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly datepipe: DatePipe,
    private readonly router: Router,
    private readonly sessionService: SessionsService,
    ) {
      this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
      this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu); 
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
      this.programmeOutcomesService.getAllOutcomeDataOfUser(this.id).subscribe(outcomeDetails => {
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
    this.router.navigate(['programme-outcome-list'], { relativeTo:this.route, queryParamsHandling: 'merge', queryParams: { id: this.id, name: this.fullName, did: this.did, status: this.programmeStatus ,pName:this.pName} });
  }

  isAuthorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }

  onExitClicked() {
    this.router.navigate([this.profileUrl+'/participant-professional-view'],  { queryParamsHandling :"merge"});
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
