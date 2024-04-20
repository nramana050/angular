import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewLernerStapes } from 'src/app/features/learners/view-learner/view-lerner-stapes';
import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProgrammeOutcomesService } from '../../programme-outcomes.service';
import { IProgrammeOutcomesList } from '../programme-outcomes-list.interface.';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../../../learner-nav';
import { IProgrammeEmployerNameList } from './iprogramme-employer-name-list';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-view-programme-outcome',
  templateUrl: './view-programme-outcome.component.html',
  styleUrls: ['./view-programme-outcome.component.scss']
})
export class ViewProgrammeOutcomeComponent implements OnInit {
  sortColumn = 'fullName';
  fullName: any;
  userId: any;
  showEmployeeStatus = false;
  showOtherFields = false;
  programDeliveryDetails;
  programmeDeliveryId: Number;
  programDeliveryStartDate: String;
  maxContactDate = new Date();
  learnerId;
  learnerOutcomeData;
  userRefData: any;
  employerList: IProgrammeEmployerNameList[] = [];
  filteredEmployerNameList: any;
  outcomeId;
  isNew: boolean = true;
  emailPattern = `([a-zA-Z0-9!@#$%^&*]{1,})`;
  outcomeStartDate;
  lernerOutComeData: any;
  dataSource: any;
  profileUrl;


  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly route: ActivatedRoute,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly viewLernerStapes: ViewLernerStapes,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly programmeOutcomesService: ProgrammeOutcomesService,

  ) { 
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
    this.setTitle();
  }

  ngOnInit(): void {
    this.resolveOutcome();
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

  resolveOutcome() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.programmeDeliveryId = params.did;
      this.learnerId = params.id;
      this.fullName = params.name;
      if (params.oId) {
        this.isNew = false;
        this.outcomeId = params.oId;
        this.programmeOutcomesService.getUserOutcome(this.outcomeId).subscribe(data => {
          this.lernerOutComeData = data;
          this.getUserRefData();
        });
      }

    })
  }

  getUserRefData() {
    this.programmeOutcomesService.getUserRefData().subscribe(data => {
      this.userRefData = data;
      this.manageAllData()
    })
  }

  manageAllData() {
    let contactStatus = this.userRefData.contactStatus;
    const contstsobj = contactStatus.find(data => data.id === this.lernerOutComeData.contactStatusId);
    let employmentStatus = this.userRefData.employmentStatus;
    const empstsobj = employmentStatus.find(data => data.id === this.lernerOutComeData.employmentStatusId)
    let outcomeType = this.userRefData.outcomeType;
    const outCMobj = outcomeType.find(data => data.id === this.lernerOutComeData.outcomeTypeId)
    let employmentType = this.userRefData.employmentType;
    const emptypeobj = employmentType.find(data => data.id === this.lernerOutComeData.employmentTypeId)
    let employmentSector = this.userRefData.employmentSector;
    const empsecobj = employmentSector.find(data => data.id === this.lernerOutComeData.employmentSectorId)

    let requiredLearnedInfo = {
      contactDate: this.lernerOutComeData?.contactDate,
      contactStatus: contstsobj?.value,
      employmentStatus: empstsobj?.value,
      outcomeType: outCMobj?.value,
      startDate: this.lernerOutComeData?.startDate,
      employer: this.lernerOutComeData?.employer,
      employmentType: emptypeobj?.value,
      employmentSector: empsecobj?.value
    }
    this.dataSource = requiredLearnedInfo;
  }

  onExit() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute, queryParamsHandling: 'merge', queryParams: { oId: null } });
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