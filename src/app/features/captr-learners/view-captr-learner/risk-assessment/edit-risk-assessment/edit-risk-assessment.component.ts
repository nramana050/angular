import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RiskAssessmentService } from '../risk-assessment.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { LearnerNavigation } from '../../learner-nav';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';

@Component({
  selector: 'app-edit-risk-assessment',
  templateUrl: './edit-risk-assessment.component.html',
  styleUrls: ['./edit-risk-assessment.component.scss']
})
export class EditRiskAssessmentComponent implements OnInit {

  suId: string;
  name: string;
  SU: string;
  id: number;
  prn: any;
  riskForm: FormGroup;
  checkboxChange: boolean = false;
  riskAssessmentData: any;
  riskOasysReport: any;
  refRiskStatus: any;
  riskAssessData: any;
  arr = [];
  isNew: Boolean = true;
  isEdit: Boolean = false;
  arr1 = [];
  selectedOrderIds = [];
  isShow = false;
  riskData: any;
  Id: any;
  answersNamesArr1=[];
  checked: boolean = false;
  radiochange: any;
  profileUrl;

  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNav: LearnerNavigation,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly riskAssessmentService: RiskAssessmentService,
    private readonly snackBarService: SnackBarService,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNav.learnerSubMenu1);
    this.setTitle();
    this.getRiskAssessmentData();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.riskForm = this.formBuilder.group({
      restart_participant: this.formBuilder.array([]),
      probation_report: [null],
      risk_assess: [null],
      professional_observ: [null, [Validators.maxLength(1000)]],
    })
  }

  get restart_participant() {
    return this.riskForm.get("restart_participant") as FormArray;
  }

  radioChangeHandler(event){
    if(event.value != 0) {
      this.radiochange = true;
    }
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.name = params.name;
      this.SU = params.SU;
      this.suId = params.id;
      this.prn = params.prn;
    });
  }

  getRiskAssessmentData() {
    this.riskAssessmentService.getRefRiskAssessmentData().subscribe(data => {
      this.riskAssessmentData = data.riskTypeList;
      this.riskOasysReport = data.oasysReportList;
      this.refRiskStatus = data.riskStatusList;
      this.fetchRiskAssessment();
    });
  }

  onExitClicked() {
    this.router.navigate([this.profileUrl+'/risk-assessment'],  { queryParamsHandling :"merge"});
  }


  onSubmit(userForm) {
    if (this.isNew) {
      this.saveRiskAssessment();
    } else {
      this.updateRiskAssessment();
    }
  }

  saveRiskAssessment() {
    const payload = this.formattedPayload();
    this.riskAssessmentService.saveRiskAssessment(payload).subscribe(response => {
      this.snackBarService.success(response.message.applicationMessage);
      this.isNew = false;
      this.onExitClicked();
    }, error => {
      this.snackBarService.error(`${error.error.applicationMessage}`);
    });
  }

  formattedPayload() {
    this.getRiskId();
    let obj = {
      "id": this.Id,
      "riskAssessmentTypeId": JSON.stringify({
        ids: this.selectedOrderIds,
      }),
      "oasysReportId": this.riskForm.controls.probation_report.value,
      "riskAssessmentStatusId": this.riskForm.controls.risk_assess.value,
      "professionalObservation": this.riskForm.controls.professional_observ.value,
      "serviceUserId": this.suId,
    }
    return obj;
  }

  updateRiskAssessment() {
    const payload = this.formattedPayload();
    this.riskAssessmentService.updateRiskAssessment(payload).subscribe(response => {
      this.snackBarService.success(response.message.applicationMessage);
      this.onExitClicked();
    }, error => {
      this.snackBarService.error(`${error.error.applicationMessage}`);
    });
  }

  getRiskId() {
    if (this.riskAssessData) {
      this.Id = this.riskAssessData.id
    }
    else {
      this.Id = 0;
    }
  }

  fetchRiskAssessment() {
    this.riskAssessmentService.fetchRiskAssessment(this.suId).subscribe(data => {
      this.riskAssessData = data;
      if (!data) {
        for (let i = 0; i < this.riskAssessmentData?.length; i++) {
          this.restart_participant.push(new FormControl(false));
        }
        this.isShow = true;
      } else {
        this.setAnswers(data, this.riskAssessmentData);
      }
      if (this.riskAssessData) {
        this.isNew = false;
      } else {
        this.isNew = true;
      }
    });
    window.scroll(1, 1);
  }

  setAnswers(data, riskAssessmentData) {
    if (data) {
      this.isNew = false;
      this.riskForm.controls.probation_report.setValue(data.oasysReportId ? data.oasysReportId : '');
      this.riskForm.controls.risk_assess.setValue(data.riskAssessmentStatusId ? data.riskAssessmentStatusId : '');
      this.riskForm.controls.professional_observ.setValue(data.professionalObservation ? data.professionalObservation : '');
      this.riskData = JSON.parse(data.riskAssessmentTypeId);
      this.selectedOrderIds = this.riskData.ids;
      if (this.riskData.ids.length > 0) {
        this.selectedOrderIds.forEach(id => {
          const filteredChoiceListArr = this.riskAssessmentData?.filter(choice => choice.id === id);
          const choiceList = filteredChoiceListArr[0];
          this.answersNamesArr1.push(choiceList?.name);
        })
      }
      for (let i = 0; i < this.riskAssessmentData?.length; i++) {
        if (this.riskData.ids.includes(this.riskAssessmentData[i].id)) {
          this.restart_participant.push(new FormControl(true));
        } else {
          this.restart_participant.push(new FormControl(false));
        }
      }
      this.isShow = true;
    }
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  updateChkbxArray(n, event, i) {
    this.checked = event.source.checked;
    let noIdRisk = this.riskAssessmentData.filter(choice => choice.name == 'No risk identified')[0].id;
    if (n.name === 'No risk identified' && event.checked === true) {
      this.riskForm.controls.restart_participant.reset();
      this.selectedOrderIds = [noIdRisk];
      this.restart_participant.at(8).patchValue(true);
    } else if (this.riskData) {
      if (this.answersNamesArr1.includes('No risk identified') || n.name != 'No risk identified') {
        this.restart_participant.at(8).patchValue(false);
        this.selectedOrderIds = this.riskForm.value.restart_participant
          .map((v, i) => v ? this.riskAssessmentData[i].id : null)
          .filter(v => v !== null);
      }
    } else {
      this.restart_participant.at(8).patchValue(false);
      this.selectedOrderIds = this.riskForm.value.restart_participant
        .map((v, i) => v ? this.riskAssessmentData[i].id : null)
        .filter(v => v !== null);
    }
  }
}

