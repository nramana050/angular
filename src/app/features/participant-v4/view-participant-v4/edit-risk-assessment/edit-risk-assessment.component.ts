import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { RiskAssessmentService } from '../risk-assessment/risk-assessment.service';
import { ParticipantV4Service } from '../../participant-v4.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { FileUploadDocumentOptions } from 'src/app/features/shared/components/file-upload/file-upload.options';
import { ErrorInput } from 'src/app/features/captr-learners/view-captr-learner/plan-content-card/track-tab/file-validation.service';
import { async } from 'rxjs';


@Component({
  selector: 'app-edit-risk-assessment',
  templateUrl: './edit-risk-assessment.component.html',
  styleUrls: ['./edit-risk-assessment.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    // { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]

})
export class EditRiskAssessmentComponent implements OnInit {

  suId: string;
  name: string;
  SU: string;
  id: number;
  prn: any;
  riskForm: FormGroup;
  checkboxChange: boolean = true;
  riskAssessmentData: any;
  riskOasysReport: any;
  refRiskStatus: any;
  riskAssessData: any;
  arr = [];
  isNew: Boolean = true;
  isEdit: Boolean = false;
  arr1 = [];
  isShow;
  riskData: any;
  Id: any;
  checked: boolean = false;
  checkedFlag: boolean = false;
  radiochange: any;
  profileUrl;
  allData;
  showPublicRisk;
  fileCtrl: FormControl;
  maxStartDate = new Date(new Date().setFullYear(new Date().getFullYear()));
  minEndDate = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
  errorInput: ErrorInput[] = [
    { id: 'filesize', message: `This file is too large to upload. The maximum supported file size is 16MB` }
  ]

  option: FileUploadDocumentOptions = {
    maxFileSize: 16777216,
    label: 'Drag file here or click to browse',
    multiple: false,
    preserveFiles: false,
    showPreviews: false,
  }
  showOtherPublicRisk: boolean = false;
  riskAssessmentId;
  selectedOrderIds = [];
  selectedPublicRiskIds = [];
  publicriskAssessment;
  riskfromGraduateslist;
  publicList =[];

  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNav: LearnerNavigation,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly riskAssessmentService: RiskAssessmentService,
    private readonly snackBarService: SnackBarService,
    private readonly participantV4Service: ParticipantV4Service,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNav.learnerSubMenu1);
  }


  
  async ngOnInit() {
    this.initForm();
    await this.getAlldeatils();
    this.setTitle();

    this.fetchRiskAssessment();

  }

  ngAfterViewInit(): void {
    const dropzoneInput = document.querySelector('.dropzone-container input.file-input');
    if (dropzoneInput) {
        dropzoneInput.setAttribute('aria-label', 'Drag file here or click to browse');
    }
  }
  
  initForm() {
    this.fileCtrl = new FormControl(null, [Validators.required]);
    this.riskForm = this.formBuilder.group({
      graduatesLevelRiskId: [null, [Validators.required]],
      riskFromGraduate: this.formBuilder.array([]),
      groupPublicRisk: this.formBuilder.array([]),
      graduateMAPPA: [null, [Validators.required]],
      mappaCategory: [null],
      mappaLevel: [null],
      mappaCategoryInfo: [null, [Validators.maxLength(500)]],
      isSexualOffendingHistory: [null, [Validators.required]],
      sexualOffendingHistory: [null, [Validators.maxLength(500)]],
      determineRiskGraduateInfo: [null, [Validators.minLength(1), Validators.maxLength(1000), Validators.required]],
      fileName: [null, [Validators.required, Validators.pattern(/^[^<>:"\/\\\|\?\*]*$/), Validators.minLength(1),
      Validators.maxLength(30)]],
      otherPublicRisk: [null, [Validators.maxLength(500)]],
      dataOfRiskAssessment: [null, [Validators.required]]
    })
  }

  get riskFromGraduate() {
    return this.riskForm.get("riskFromGraduate") as FormArray;
  }

  get groupPublicRisk() {
    return this.riskForm.get("groupPublicRisk") as FormArray;
  }

  radioChangeHandler(event,control) {
    if (event.value != 0) {
      this.radiochange = true;
    }
    if(event.value== 2 && control =='graduateMAPPA' ){
      this.riskForm.get('mappaCategory')?.clearValidators();
      this.riskForm.get('mappaCategory')?.reset();
      this.riskForm.get('mappaLevel')?.clearValidators();
      this.riskForm.get('mappaLevel')?.reset();
      this.riskForm.get('mappaCategoryInfo')?.clearValidators();
      this.riskForm.get('mappaCategoryInfo')?.reset();
    }
    if(event.value== 2 && control =='isSexualOffendingHistory'){
      this.riskForm.get('sexualOffendingHistory')?.clearValidators();
      this.riskForm.get('sexualOffendingHistory')?.reset();
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

  onExitClicked() {
    this.router.navigate([this.profileUrl + '/risk-assessment'], { queryParamsHandling: "merge" });
  }

  onSubmit(userForm) {
    if (this.isNew) {
      this.saveRiskAssessment();
    } else {
      this.updateRiskAssessment();
    }
  }

  async getAlldeatils() {
    
    await this.participantV4Service.getRefDataAllDetails().toPromise().then((data: any) => {
      this.allData = data;
      this.riskfromGraduateslist = this.allData?.refDataMap?.Risk_From_Graduate;
      this.publicriskAssessment = this.allData?.refDataMap?.Public_At_Risk;
      for (let i = 0; i < this.riskfromGraduateslist?.length; i++) {
        this.riskFromGraduate.push(new FormControl(false));
      }

    })
  }

  fetchRiskAssessment() {
   
    this.riskAssessmentService.fetchRiskAssessment(this.suId).subscribe(data => {
      this.riskAssessData = data;
      
      if (this.riskAssessData) {
        this.isNew = false;
        this.riskAssessmentId = this.riskAssessData.id;
        this.patchriskFromGraduate(data, this.riskfromGraduateslist);
        this.patchgroupPublicRisk(data, this.allData?.refDataMap?.Public_At_Risk);
        this.riskForm.controls.fileName.setValue(data.fileName ? data.fileName : '');
        this.riskForm.controls.graduatesLevelRiskId.setValue(data.graduatesLevelRiskId);
        this.riskForm.controls.graduateMAPPA.setValue(data.graduateMAPPA);
        this.riskForm.controls.mappaCategory.setValue(data.mappaCategory);
        this.riskForm.controls.mappaLevel.setValue(data.mappaLevel);
        this.riskForm.controls.mappaCategoryInfo.setValue(data.mappaCategoryInfo != 'null'? data.mappaCategoryInfo : '');
        this.riskForm.controls.isSexualOffendingHistory.setValue(data.isSexualOffendingHistory);
        this.riskForm.controls.determineRiskGraduateInfo.setValue(data.determineRiskGraduateInfo != 'null' ? data.determineRiskGraduateInfo : '');
        this.riskForm.controls.dataOfRiskAssessment.setValue(data.dataOfRiskAssessment != 'null' ? data.dataOfRiskAssessment : '');
        this.riskForm.controls.sexualOffendingHistory.setValue(data.sexualOffendingHistory != 'null' ? data.sexualOffendingHistory : '');
        if(data.othrPublicRisk!='' && data.othrPublicRisk!= null && data.othrPublicRisk!= 'null'){
           this.showOtherPublicRisk=true
        }
        this.riskForm.controls.otherPublicRisk.setValue(data.othrPublicRisk != 'null' ? data.othrPublicRisk : '');
      
        this.isShow = true;
      } else {
        this.isShow = true;
        this.isNew = true;
        
      }
    });
    window.scroll(1, 1);
  }
  patchgroupPublicRisk(data,riskAssessmentData) {
    if (data) {
      this.selectedPublicRiskIds = data.groupPublicRiskIds;
      if(this.selectedPublicRiskIds?.length>0){
        for (let i = 0; i < riskAssessmentData?.length; i++) {
          if (data.groupPublicRiskIds?.includes(riskAssessmentData[i]?.id)) {
            this.groupPublicRisk.push(new FormControl(true));
            this.showPublicRisk = true;
          } else {
            this.groupPublicRisk.push(new FormControl(false));
          }
        }
      }else{
        this.selectedPublicRiskIds=[];
      }
    
    }
  }

  patchriskFromGraduate(data, riskAssessmentData) {
    if (data) {
      this.riskFromGraduate.clear();
      this.selectedOrderIds = data.riskFromGraduateIds;
      console.log("riskAssessmentData",riskAssessmentData);
      
      for (let i = 0; i < riskAssessmentData.length; i++) {
        if (this.selectedOrderIds?.includes(riskAssessmentData[i]?.id)) {
          this.riskFromGraduate.push(new FormControl(true));
          this.checkedFlag = true;
        } else {
          this.riskFromGraduate.push(new FormControl(false));
        }    
      }
    }
  }


  saveRiskAssessment() {
    const formData = this.parseData(this.fileCtrl.value);
    this.riskAssessmentService.saveRiskAssessment(formData, 'POST').then(response => {
      this.snackBarService.success('Risk assessment added successfully');
      this.onExitClicked();
    }, error => {
      this.snackBarService.error(`${error.error.applicationMessage}`);
    });
  }

  updateRiskAssessment() {
    const formData = this.parseData(this.fileCtrl.value);
    this.riskAssessmentService.saveRiskAssessment(formData, 'POST').then(response => {
      this.snackBarService.success('Risk assessment updated successfully');
      this.onExitClicked();
    }, error => {
      this.snackBarService.error(`${error.error.applicationMessage}`);
    });
  }

  private parseData(file: File): FormData {
    const data = this.riskForm.getRawValue();
    let riskAssessmentDate = Utility.transformDateToString(data.dataOfRiskAssessment);
    data.reviewDate = this.reviewDate();
    let reviewDateformat = Utility.transformDateToString(data.reviewDate);
    this.setNonMandatoryFieldNull(data);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('serviceUserId', this.suId);
    formData.append('id', this.riskAssessmentId ? this.riskAssessmentId : null);
    formData.append('fileName', data.fileName);
    formData.append('graduatesLevelRiskId', data.graduatesLevelRiskId);
    formData.append('riskFromGraduate', JSON.stringify(this.selectedOrderIds));
    formData.append('groupPublicRisk', JSON.stringify(this.selectedPublicRiskIds));
    formData.append('graduateMAPPA', data.graduateMAPPA);
    formData.append('mappaCategory', data.mappaCategory);
    formData.append('mappaLevel', data.mappaLevel);
    formData.append('mappaCategoryInfo', data.mappaCategoryInfo);
    formData.append('isSexualOffendingHistory', data.isSexualOffendingHistory);
    formData.append('sexualOffendingHistory', data.sexualOffendingHistory);
    formData.append('determineRiskGraduateInfo', data.determineRiskGraduateInfo);
    formData.append('dataOfRiskAssessment', riskAssessmentDate);
    formData.append('reviewDate', reviewDateformat);
    formData.append('othrPublicRisk', data.otherPublicRisk)
    return formData;
  }


  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  updateChkbxArrayForGraduates(n, event, index) {
    this.checked = event.source.checked; //true
    
    if (this.checked === true) {
      this.checkedFlag = true;
      if (n.id == 885) {      
        for (let i = 0; i < this.publicriskAssessment?.length; i++) {
          this.groupPublicRisk.push(new FormControl(false));
        }
        this.checkboxChange = false;
        this.showPublicRisk = true;
      }
      if (n.id != 888) {
        this.riskFromGraduate.at(4).patchValue(false);
      }
      else{
        this.groupPublicRisk.clear();
        this.showPublicRisk = false;
        this.checkboxChange = true;
        this.showOtherPublicRisk =false;
        this.riskForm.get('otherPublicRisk')?.clearValidators();
        this.riskForm.get('otherPublicRisk')?.reset();
        this.selectedPublicRiskIds=[];
        this.showPublicRisk = false;
        this.riskFromGraduate.controls.forEach((control, i) => {
          control.setValue(i === index);
        });
      }
    } else if (this.checked === false) {
      if (n.id == 885) {
        this.groupPublicRisk.clear();
        this.showPublicRisk = false;
        this.checkboxChange = true;
        this.showOtherPublicRisk =false;
        this.riskForm.get('otherPublicRisk')?.clearValidators();
        this.riskForm.get('otherPublicRisk')?.reset();
        this.selectedPublicRiskIds=[];
      }
    } else {
      this.checkboxChange = true;
      this.showPublicRisk = false
    }
    if (this.riskFromGraduate.length <1) {
      this.checkedFlag = false;
    }
    this.selectedOrderIds = this.riskForm.value.riskFromGraduate
    .map((v, i) => v ? this.riskfromGraduateslist[i]?.id : null)
    .filter(v => v !== null);
   this.selectedOrderIds = this.selectedOrderIds.filter(v => v !== undefined);
     if (this.selectedOrderIds.length <1) {
      this.checkedFlag = false;
    }

  }

  updateChkbxArrayforpublic(n, event, index) {
    this.checked = event.source.checked; //true
   this.publicList.push(n.id);
    if (this.checked === true) {
      this.checkboxChange = true;
      if (n.id != 895) {

        if (n.id == 894) {
          this.showOtherPublicRisk = true;
        }  
            if(this.publicList.includes(895) ){
             let index = this.publicriskAssessment.findIndex(value => value.id === 895 );
             this.groupPublicRisk.at(index).patchValue(false);

            }        
      }  else{
        this.showOtherPublicRisk =false;
        this.riskForm.get('otherPublicRisk')?.clearValidators();
        this.riskForm.get('otherPublicRisk')?.reset();
        this.publicList =[];
        this.publicList.push(n.id);
        this.groupPublicRisk.controls.forEach((control, i) => {
          control.setValue(i === index);
        });

      }
    } else if (this.checked === false) {
      const index = this.groupPublicRisk.value.findIndex(value => value === n.id);
      if (index !== -1) {
        this.groupPublicRisk.removeAt(index);
      }
      if (n.id == 894) {
        this.showOtherPublicRisk = false;
        this.riskForm.get('otherPublicRisk')?.clearValidators();
        this.riskForm.get('otherPublicRisk')?.reset();
      }
    }

    this.selectedPublicRiskIds = this.riskForm.value.groupPublicRisk
    .map((v, i) => v ? this.allData?.refDataMap?.Public_At_Risk[i]?.id : null)
    .filter(v => v !== null);
  this.selectedPublicRiskIds = this.selectedPublicRiskIds.filter(v => v !== undefined);
  if (this.selectedPublicRiskIds.length <1) {
    this.checkboxChange = false;
  }  
}

  onFileSelected(files: File[]) {
    let selectedFile = null;
    if (files.length > 0) {
      selectedFile = files[0];
    }
    this.fileCtrl.setValue(selectedFile);
  }

  reviewDate(): Date {
    const selectedDate = this.riskForm.controls.dataOfRiskAssessment.value;
    if (selectedDate) {
      const selectedDateObj = new Date(selectedDate);
      const resultDateObj = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth() + 3, selectedDateObj.getDate());
      return resultDateObj;
    }
    else
      return null;
  }

  setNonMandatoryFieldNull(data) {
    if (data.graduateMAPPA === "") {
      data.graduateMAPPA = null;
    }
    if (data.MAPPACategory === "") {
      data.MAPPACategory = null;
    }
    if (data.MAPPAlevel === "") {
      data.MAPPAlevel = null;
    }
    if (data.isSexualOffendingHistory === "") {
      data.isSexualOffendingHistory = null;
    }
    if (data.mappaCategoryInfo === "") {
      data.mappaCategoryInfo = null;
    }
    if(data.sexualOffendingHistory === ""){
      data.sexualOffendingHistory  =null;
    }
    if (data.id === undefined) {
      data.id = null;
    }
    if (data.riskFromGraduate.length < 0) {
      data.riskFromGraduate.reset();
    }
    if (data.groupPublicRisk.length < 0) {
      data.groupPublicRisk.reset();
    }

  }

  saveButtonDisabled(): boolean {
     return (this.riskForm.invalid || this.fileCtrl.invalid || !this.checkedFlag || !this.checkboxChange);
  }

}