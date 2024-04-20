import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { CaptrLearnersService } from 'src/app/features/captr-learners/captr-learners.services';
import { ViewLernerStapes } from'src/app/features/learners/view-learner/view-lerner-stapes';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-view-programme-enrolment',
  templateUrl: './view-programme-enrolment.component.html',
  styleUrls: ['./view-programme-enrolment.component.scss']
})
export class ViewProgrammeEnrolmentComponent implements OnInit {

  userId: any;
  id:any;
  did:any;
  refData: any;
  enrolmentDetails: any;
  programDetails: any
  params: any;
  actionOperation: any;
  dataSource=new MatTableDataSource();
  profileUrl;

  displayedColumns: string[] = ['Coursename', 'Coursecompleted', 'Startdate', 'Enddate', 'Attemptdate', 'Qulificationoutcome', 'Qulificationexpirydate', 'Qualificationrefranceid'];
  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly stepperNavigationService: StepperNavigationService,

  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);

    this.route.queryParams.subscribe((params: any) => {     
    this.id = + params.id;
    this.did = + params.did;
    this.params = params;
    this.getDataforView(this.id,this.did);
  })
  this.setTitle();
 }

 ngOnInit(): void {
  
}
getDataforView(id,did) {
  this.captrLearnersService.getLearnerEnrolmentDetails(id, did).subscribe(enrolmentDetails => {
    this.enrolmentDetails = enrolmentDetails;
    this.dataSource.data=enrolmentDetails.withdrawLearnerCourseDetails;
  
    
    this.captrLearnersService.getRefData().subscribe(data => {
      this.refData = data;
      
      this.manageProgrammeDetails()
    })
  })

}
manageProgrammeDetails() {
  let reason=null;
  let programStatus='In Progress'
  if (this.enrolmentDetails.withdrawalReasonId != null) {
   let reasons = this.refData.withdrawlReason.find(data => data.id === this.enrolmentDetails.withdrawalReasonId);
   reason=reasons.value;
  }
  if(this.enrolmentDetails.programStatus!=null)
  {
   let program = this.refData.programStatus.find(data => data.id === this.enrolmentDetails.programStatus);
    programStatus=program.value;
  }
  
  this.programDetails = {
    programmeName:this.params.pName,
    cohortNumber: this.enrolmentDetails.programmeDeliverySeq,
    programEndDate: this.enrolmentDetails.actualEndDate,
    programStatus: programStatus,
    withdrawlReason: reason,
  }
}
navigateToWorkshopAttendance() {
  this.router.navigate([this.profileUrl+'/digital-course-progress/programme-enrolment'],  { queryParamsHandling :"merge"}); 
}

ngOnDestroy() {
  this.inPageNavService.setNavItems(null);
}

setTitle() {
  this.route.queryParams.subscribe((params: any) => {
    this.userId = params.id;
    this.route.snapshot.data.title = `${params.name}`;
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