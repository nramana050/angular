import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { LearnersService } from '../../learners.services';
import { ViewLernerStapes } from '../../view-learner/view-lerner-stapes';


@Component({
  selector: 'app-view-enrolment-details',
  templateUrl: './view-enrolment-details.component.html',
  styleUrls: ['./view-enrolment-details.component.scss']
})
export class ViewEnrolmentDetailsComponent implements OnInit {
 id:any;
 did:any;
  refData: any;
  enrolmentDetails: any;
  programDetails: any
  params: any;
  actionOperation: any;
  dataSource=new MatTableDataSource();
  displayedColumns: string[] = ['Coursename', 'Coursecompleted', 'Startdate', 'Enddate', 'Attemptdate', 'Qulificationoutcome', 'Qulificationexpirydate', 'Qualificationrefranceid'];
  constructor(
    private readonly learnersService: LearnersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly viewLernerStapes: ViewLernerStapes,
  ) {
    this.stepperNavigationService.stepper(this.viewLernerStapes.stepsConfig);
    this.route.queryParams.subscribe((params: any) => {
      
      this.id = + params.id;
      this.did = + params.did;
      this.params = params;
      this.getDataforView(this.id,this.did);
    })
  }

  ngOnInit(): void {
    this.stepperNavigationService.stepper(this.viewLernerStapes.stepsConfig);
    
   
  }
  getDataforView(id,did) {
    this.learnersService.getLearnerEnrolmentDetails(id, did).subscribe(enrolmentDetails => {
      this.enrolmentDetails = enrolmentDetails;
      this.dataSource.data=enrolmentDetails.withdrawLearnerCourseDetails;
    
      
      this.learnersService.getRefData().subscribe(data => {
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
    this.route.queryParams.subscribe((params: any) => {
      this.router.navigate(['/learners/enrolment-details'], { queryParamsHandling: 'merge', queryParams: { id: params.id, name: params.name } });
    });
  }
}