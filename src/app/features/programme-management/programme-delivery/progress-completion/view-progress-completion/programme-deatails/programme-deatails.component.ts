import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';
import { ProgrammesService } from 'src/app/features/programme-management/programmes/programmes.service';
import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProgrammeDeliveryService } from '../../../programme-delivery.service';
import { ViewProgrammeDeliveryNavigation } from '../../../view-programme-delivery/view-programme-delivery-nav';
import { ViewProgressCompletionSteps } from '../view-progress-completion-steps';

@Component({
  selector: 'app-programme-deatails',
  templateUrl: './programme-deatails.component.html',
  styleUrls: ['./programme-deatails.component.scss']
})
export class ProgrammeDeatailsComponent implements OnInit {
  currentCourseLearners = [];
  programDetails: any;
  allLearners: any;
  progressCompletionData: any;
  displayedColumns: string[] = ['lernerName', 'isCompleted'];
  programCompletedStatus = null;
  dataSource = new MatTableDataSource();
  id: number
  constructor(private readonly route: ActivatedRoute,
    private readonly programmeDeliveryService: ProgrammeDeliveryService,
    private readonly manageUserService: ManageUsersService,
    private readonly viewProgressCompletionSteps: ViewProgressCompletionSteps,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly viewProgrammeDeliveryNavigation: ViewProgrammeDeliveryNavigation,
    private readonly inPageNavService: InPageNavService,
  ) {
    this.stepperNavigationService.stepper(this.viewProgressCompletionSteps.stepsConfig);
  }

  ngOnInit() {
    this.inPageNavService.setNavItems(this.viewProgrammeDeliveryNavigation.programmeDeliverySubMenu);
    this.createProgramDetails()
  }

  createProgramDetails() {
    this.id = + this.route.snapshot.queryParamMap.get('id');
    let programName = this.route.snapshot.queryParamMap.get('pname');
    this.programmeDeliveryService.getProgressAndCompletionData(this.id).subscribe(data => {
      this.progressCompletionData = data;
      let programDetail = data.programmeCompletionDetails;
      this.programCompletedStatus = programDetail.programmeCompletionStatus;
      if (programDetail.programmeCompletionStatus === true) {
        this.programDetails = {
          programmeDeliveryId: this.progressCompletionData.programmeDeliveryId,
          programmeActualEndDate: programDetail.programmeActualEndDate,
          programmeCompletionStatus: programDetail.programmeCompletionStatus,
          programName: programName
        }
        this.manageUserService.getAllSuUserByLggedInClient().subscribe(data => {
          this.allLearners = data;
          this.manageProgramDetails();
          this.dataSource.data = this.currentCourseLearners;
        })}
    })
  }



  manageProgramDetails() {
    let lernerforView = this.progressCompletionData.programmeCompletionDetails.learnerProgrammeDetails;
    for (const learner of this.allLearners) {
      const obj = lernerforView.find(data => data.learnerId === learner.id);
      if (obj) {
        const requiredLearnedInfo = {
          learnerId: obj.learnerId,
          lernerName: learner.firstName + " " + learner.lastName,
          isCompleted: obj.isCompleted == true ? "Yes" : "No",
          qualificationOutcome: []
        }
        this.currentCourseLearners.push(requiredLearnedInfo);
      }
    }
  }
}
