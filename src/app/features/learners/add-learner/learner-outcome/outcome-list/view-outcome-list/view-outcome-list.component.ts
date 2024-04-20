import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewLernerStapes } from 'src/app/features/learners/view-learner/view-lerner-stapes';
import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { Utility } from 'src/app/framework/utils/utility';
import { LearnersOutcomeService } from '../../learner-outcome-service';
import { IEmployerNameList } from '../add-outcome/IEmployerNameList';

@Component({
  selector: 'app-view-outcome-list',
  templateUrl: './view-outcome-list.component.html',
  styleUrls: ['./view-outcome-list.component.scss']
})
export class ViewOutcomeListComponent implements OnInit {

  showEmployeeStatus = false;
  showOtherFields = false;
  programDeliveryDetails;
  programmeDeliveryId: Number;
  programDeliveryStartDate: String;
  maxContactDate = new Date();
  learnerId;
  learnerOutcomeData;
  userRefData: any;
  employerList: IEmployerNameList[] = [];
  filteredEmployerNameList: any;
  outcomeId;
  isNew: boolean = true;
  emailPattern = `([a-zA-Z0-9!@#$%^&*]{1,})`;
  outcomeStartDate;
  lernerOutComeData: any;
  dataSource: any;

  constructor(
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly viewLernerStapes: ViewLernerStapes,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly learnerOutcomeService: LearnersOutcomeService
  ) {
    this.stepperNavigationService.stepper(this.viewLernerStapes.stepsConfig);
  }

  ngOnInit(): void {
    this.resolveOutcome();
  }

  resolveOutcome() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.programmeDeliveryId = params.did;
      this.learnerId = params.id;

      if (params.oId) {
        this.isNew = false;
        this.outcomeId = params.oId;
        this.learnerOutcomeService.getUserOutcome(this.outcomeId).subscribe(data => {
          this.lernerOutComeData = data;
          this.getUserRefData();
        });
      }

    })
  }

  getUserRefData() {
    this.learnerOutcomeService.getUserRefData().subscribe(data => {
      this.userRefData = data;
      this.mangealldata()
    })
  }

  mangealldata() {
    console.log('lernerOutComeData===>', this.lernerOutComeData);
    console.log('ref data===>', this.userRefData);
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
}
