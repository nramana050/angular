import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { EditParticipantV4Steps } from '../add-edit-participant-v4/edit-participant-v4.steps';
import { ParticipantV4Service } from '../participant-v4.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';

@Component({
  selector: 'app-clink-further-information',
  templateUrl: './clink-further-information.component.html',
  styleUrls: ['./clink-further-information.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class ClinkFurtherInformationComponent implements OnInit, OnDestroy {

  learnersForm: FormGroup;
  unemployedFlag: any;
  maxDateOfRecall = new Date(new Date().setFullYear(new Date().getFullYear()));
  minDateOfRecall = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
  maxDateOfRelease = new Date(new Date().setFullYear(new Date().getFullYear() + 100));
  currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  lrnPattern = `[a-zA-Z0-9\ ]+`;
  prnPattern = `[A-Z][0-9]{4}[A-Z]{2}`;
  namePattern = `[^0-9\\r\\n\\t|\"]+$`;
  emailPattern = /^[a-z0-9._%+'-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  postCodePattern =
    /^(([A-Z][0-9]{1,2})|(([A-Z][A-HJ-Y][0-9]{1,2})|(([A-Z][0-9][A-Z])|([A-Z][A-HJ-Y][0-9]?[A-Z])))) [0-9][A-Z]{2}$/;
  niNumberPattern =
    /^(?!BG)(?!GB)(?!NK)(?!KN)(?!TN)(?!NT)(?!ZZ)[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}(\s?)[0-9]{2}(\s?)[0-9]{2}(\s?)[0-9]{2}(\s?)[A-D]{1}$/;
  phoneNumberPattern = /^(\d{7}|\d{11})$/;

  ethnicityRefData;
  refAnswer: any;
  titles = ['Ms', 'Mx', 'Mrs', 'Miss', 'Mr', 'Dr', 'Prof', 'Lady', 'Sir', 'Rev', 'Lord', 'Maj',
    'Capt', 'Pte', 'Sgt', 'Ssgt', 'Lt', 'Col', 'Brig', 'Cpl', 'Lcpl', '2Lt', 'WO1', 'WO2', 'Master', 'Other', 'N/A'];

  isNew = false;
  genderList: any;
  highLevelQualificationList: any
  deactivated: boolean;
  ethnicityList
  onlyCharsPattern = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
  firstNamePattern = `([a-zA-Z]{1,})`;
  lastNamePattern = `([a-zA-Z]{1,}(\\s?|'?|-?)[a-zA-Z]{1,})`;
  refData;
  idAndDocFlag = false;
  externalSupport = false;
  refStatus = [{
    id: 1,
    status: "Still trading"
  }]
  isCheckedSupport;
  isReferralTypeId: any;
  allData;
  furtherInfoData: any;
  releaseStatus;
  hasBeenRecalled;
  prisonInfoId;
  utrNumberRegex = /^\d{10}$/;


  constructor(private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly captrLearnersService: ParticipantV4Service,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly editP4LeanerSteps: EditParticipantV4Steps,
    private readonly participantV4Service: ParticipantV4Service  ) {
    this.stepperNavigationService.stepper(this.editP4LeanerSteps.stepsConfig);
    this.participantV4Service.getRefAnswer().subscribe(data => {
      this.refAnswer = data;
      this.refAnswer = this.refAnswer.filter(ref => ref.identifier !== 'PNS')

    })

  }

  ngOnInit(): void {
    this.findRefData();
    this.getRefDataAndInitForm();

  }
  async findRefData(){
    await this.participantV4Service.getRefDataAllDetails().toPromise().then(data => {
      this.allData = data;
    })
  }

  async getRefDataAndInitForm() {
    await this.participantV4Service.getFurtherInfoRefData().toPromise().then(data => {
      this.refData = data;
      this.initLearnersForm()

    })
    
  }

  ngOnDestroy() {
    this.stepperNavigationService.stepper(null);
  }

  navigateHome() {
    this.router.navigate(['./clink-learners']);
  }

  initLearnersForm() {
    this.createLearnersForm();
    this.route.queryParams.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.learnersForm.get('participantId').patchValue(+params['id'])
        this.isNew = false;
        this.participantV4Service.getFurtherInfo(+params['id'])
          .subscribe(
            (data: any) => {
              this.furtherInfoData = data;
              this.releaseStatus = this.furtherInfoData.prisonInformation.isReleasedFromPrisonInLastTwoYears;
               this.prisonInfoId = data.prisonInformation.id
               this.learnersForm.patchValue(data); 
                if(this.learnersForm.get('prisonInformation').get('hasGraduateBeenRecalled').value === 1 && data.prisonInformation.isReleasedFromPrisonInLastTwoYears == 878){
                  this.learnersForm.get('prisonInformation').get('dateOfRelease').disable();
                 }   
               this.patchExteranSupport(data.externalSupports?.externalSupportList);
               this.patchIdAndDocuments(data.idAndDocuments?.idAndDocumentList);
            },
            error => {
              this.snackBarService.error(`${error.error.applicationMessage}`);
              this.navigateHome();
            }
          );
      } else {
        this.isNew = true;
      }
    });
  }

  patchIdAndDocuments(idAndDocumentList: any) {

    this.idAndDocumentForm.reset();

    idAndDocumentList?.forEach(data => {
      const docIds = this.refData.document.map(d => d.id);
      const index = docIds.indexOf(data.documentId);
      this.idAndDocumentForm.at(index).get('documentId').patchValue(data.documentId);
      this.idAndDocumentForm.at(index).get('documentLocation').patchValue(data.documentLocation);
      this.idAndDocumentForm.at(index).get('documentDescription').patchValue(data.documentDescription);
    });

  }

  patchExteranSupport(externalSupportList: any) {

    this.externalSupportForm.reset();

    externalSupportList?.forEach(element => {
      const supportAreaIds = this.refData.supportArea.map(s => s.id);
      const index = supportAreaIds.indexOf(element.supportAreaId);
      this.externalSupportForm.at(index).get('supportAreaId').patchValue(element.supportAreaId)
      this.externalSupportForm.at(index).get('providingSupport').patchValue(element.providingSupport)
      this.externalSupportForm.at(index).get('supportDetails').patchValue(element.supportDetails)
    });

  }

  checkSupportId(i, item) {
    let currnet_group = this.externalSupportForm.at(i) as FormGroup;
    if (this.externalSupportForm.at(i).get('supportAreaId').value) {
      if(!currnet_group.get('providingSupport') && !currnet_group.get('supportDetails')){
        currnet_group.addControl('providingSupport', new FormControl('', Validators.required))
        currnet_group.addControl('supportDetails', new FormControl('', Validators.required))
      }
      this.externalSupportForm.at(i).get('supportAreaId').patchValue(item.id)
      this.idAndDocumentForm.at(i).get('providingSupport').addValidators([Validators.required])
      this.idAndDocumentForm.at(i).get('supportDetails').addValidators([Validators.required])
    }
    else {
      this.externalSupportForm.at(i).get('supportAreaId').patchValue(null)
      currnet_group.removeControl('providingSupport');
      currnet_group.removeControl('supportDetails');
    }
  }

  checkIdAndDoc(i, item) {
    
    let currnet_group = this.idAndDocumentForm.at(i) as FormGroup;
    if (this.idAndDocumentForm.at(i).get('documentId').value) {
      if(!currnet_group.get('documentLocation') && !currnet_group.get('documentDescription')){
        currnet_group.addControl('documentLocation', new FormControl('', Validators.required))
        currnet_group.addControl('documentDescription', new FormControl('', Validators.required))
      }
      this.idAndDocumentForm.at(i).get('documentId').patchValue(item.id)
      this.idAndDocumentForm.at(i).get('documentLocation').addValidators([Validators.required])
      this.idAndDocumentForm.at(i).get('documentDescription').addValidators([Validators.required])
    }
    else {
      this.idAndDocumentForm.at(i).get('documentId').patchValue(null)
      currnet_group.removeControl('documentLocation');
      currnet_group.removeControl('documentDescription');
    }        
  }

  createLearnersForm() {
    this.learnersForm = this.fb.group({
      participantId: [null],
      prisonInformation: this.getPrisonInformationForm(),
      externalSupports: this.getExternalSupports(),
      idAndDocuments: this.getIdAndDocuments(),
      selfEmployment: this.getSelfEmploymentForm(),
      probationInformation: this.getProbationInformationForm()
    });

    this.refData.supportArea.forEach(data => {
      this.externalSupportForm.push(this.fb.group({
        supportAreaId: [],
        providingSupport: [null, [Validators.maxLength(50)]],
        supportDetails: [null, [Validators.maxLength(100)]]
      }));
    });

    this.refData.document.forEach(doc => {
      this.idAndDocumentForm.push(this.fb.group({
        documentId: [],
        documentDescription: [null, [Validators.maxLength(50)]],
        documentLocation: [null, [Validators.maxLength(50)]],
      }))
    })
  }

  getProbationInformationForm(){
    const probationInfo = this.fb.group({
      probationOfficerName: [null, [Validators.maxLength(100),Validators.minLength(3)]],
      probationOffice: [null, [Validators.maxLength(100),Validators.minLength(3)]],
      contactNumber: [null, [ Validators.pattern(this.phoneNumberPattern)]],
      contactEmail: [null, [ Validators.maxLength(100), Validators.pattern(this.emailPattern)]],
    })
     return probationInfo;
  }

  getExternalSupports() {
    const externalSupports = this.fb.group({
      externalSupportList: new FormArray([])
    })
    return externalSupports;
  }

  getIdAndDocuments() {
    const idAndDocuments = this.fb.group({
      idAndDocumentList: new FormArray([])
    })
    return idAndDocuments;
  }

  getSelfEmploymentForm() {
    const selfEmploymentForm = this.fb.group({
      id: [null],  
      isProbation: [null],
      isPreviouslySelfEmployed: [null],
      utrNumber: [null, [Validators.pattern(this.utrNumberRegex),Validators.maxLength(10), Validators.minLength(10)]],
      tradingStatus: [null],
      hasBusinessPlan: [null]
    })
    return selfEmploymentForm;
  }

  getPrisonInformationForm() {
    const prisonInformationForm = this.fb.group({
      id: [null],
      isReleasedFromPrisonInLastTwoYears: [null],
      prisonLocation: [null,[Validators.required]],
      dateOfRelease: [null,[Validators.required]],
      licenceBailCondition: [null,[Validators.required]],
      hasGraduateBeenRecalled: [null,[Validators.required]],
      recalledDate: [null],
      recallReason:[null],
      otherRecallReason: [null,[Validators.maxLength(100), Validators.minLength(3)]],
      locationOfPrisonRecall: [null]
    })
    return prisonInformationForm;
  }

  isReleasedStatus(): string {
    const dateOfRelease = this.learnersForm.get('prisonInformation').get('dateOfRelease').value;
    const twoYearsLater = new Date();
        twoYearsLater.setFullYear(twoYearsLater.getFullYear() + 2); 
   
    if (dateOfRelease) {
      if (dateOfRelease < this.currentDate ) {
        this.releaseStatus = 878 ;   //YES
      } else if(dateOfRelease >= this.currentDate && dateOfRelease < twoYearsLater){
          this.releaseStatus =  880 ;    //IN CUSTODY
      } else if(dateOfRelease > twoYearsLater){
        this.releaseStatus =  879 ;  //no
      }
    } 
    return this.releaseStatus;
  }

  graduateRecallReset(){
    if (this.learnersForm.get('prisonInformation').get('hasGraduateBeenRecalled').value === 1) {
      return true;
    }
    else {
      // this.learnersForm.get('prisonInformation').get('hasGraduateBeenRecalled').reset();
      return false;
    }
  }

  otherRecallReasonReset() {
    if (this.learnersForm.get('prisonInformation').get('recallReason').value === 877) {
      this.learnersForm.get('prisonInformation').get('otherRecallReason').setValidators([Validators.required , Validators.maxLength(100), Validators.minLength(3)]);
      return true;
    }
    else {
      this.learnersForm.get('prisonInformation').get('otherRecallReason').clearValidators();
      this.learnersForm.get('prisonInformation').get('otherRecallReason').reset();

      return false;
    }
  }

   
onSubmit() {
  if (!this.prisonInfoId){
      this.createLearner();
    } else {
      this.updateLearner();
    }
  }

  createLearner() {
    const payload = this.learnersForm.getRawValue();
     payload.prisonInformation.isReleasedFromPrisonInLastTwoYears = this.releaseStatus ;
     this.setNonMandatoryFieldsToNull(payload);
    this.participantV4Service.saveFurtherInfo(payload).subscribe(resp => {
      this.createOrUpdateLearner(resp);
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  updateLearner() {
    const payload = this.learnersForm.getRawValue();
    payload.prisonInformation.isReleasedFromPrisonInLastTwoYears = this.releaseStatus ;
    this.setNonMandatoryFieldsToNull(payload);
    this.participantV4Service.updateFurtherInfo(payload).subscribe(resp => {
      this.createOrUpdateLearner(resp);
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  createOrUpdateLearner(resp:any) {
    this.snackBarService.success(resp.message.applicationMessage);
    this.router.navigate(['./clink-learners']);
  }

  get externalSupportForm() {
    return this.learnersForm.get('externalSupports').get('externalSupportList') as FormArray;
  }
  get idAndDocumentForm() {
    return this.learnersForm.get('idAndDocuments').get('idAndDocumentList') as FormArray;
  }

  recalledReset(event,control){  
     if(this.learnersForm.get('prisonInformation').get('hasGraduateBeenRecalled').value === 2){
      this.learnersForm.get('prisonInformation').get('recalledDate').clearValidators();
      this.learnersForm.get('prisonInformation').get('recalledDate').reset();
      this.learnersForm.get('prisonInformation').get('recallReason').clearValidators();
      this.learnersForm.get('prisonInformation').get('recallReason').reset();
      this.learnersForm.get('prisonInformation').get('otherRecallReason').clearValidators();
      this.learnersForm.get('prisonInformation').get('otherRecallReason').reset();
      this.learnersForm.get('prisonInformation').get('locationOfPrisonRecall').clearValidators();
      this.learnersForm.get('prisonInformation').get('locationOfPrisonRecall').reset();
     }  
     if(this.prisonInfoId){
     if(event === 1 && control=='hasGraduateBeenRecalled'){
      this.learnersForm.get('prisonInformation').get('dateOfRelease').disable();
      this.learnersForm.get('prisonInformation').get('prisonLocation').clearValidators();
      this.learnersForm.get('prisonInformation').get('prisonLocation').disable(); 
     }else if(event === 2 && control=='hasGraduateBeenRecalled'){
      this.learnersForm.get('prisonInformation').get('dateOfRelease').enable();
      this.learnersForm.get('prisonInformation').get('dateOfRelease').updateValueAndValidity();
      // this.learnersForm.get('prisonInformation').get('dateOfRelease').setValidators([Validators.required,this.dateRangeValidator()]);
      this.learnersForm.get('prisonInformation').get('dateOfRelease').updateValueAndValidity();
      this.learnersForm.get('prisonInformation').get('prisonLocation').enable();
      this.learnersForm.get('prisonInformation').get('prisonLocation').setValidators([Validators.required]);
      this.learnersForm.get('prisonInformation').get('prisonLocation').updateValueAndValidity();
     }
     }  
   }

  setNonMandatoryFieldsToNull(payload){

    if (payload.probationInformation.probationOfficerName === "") {
      payload.probationInformation.probationOfficerName = null;
    }
    if (payload.probationInformation.probationOffice === "") {
      payload.probationInformation.probationOffice = null;
    }
    if (payload.probationInformation.contactNumber === "") {
      payload.probationInformation.contactNumber = null;
    }
    if (payload.probationInformation.contactEmail  === "") {
      payload.probationInformation.contactEmail = null;
    }
    if (payload.selfEmployment.utrNumber  === "") {
      payload.selfEmployment.utrNumber = null;
    }
  }

  isPrisonLocation(event) { 
    if(this.prisonInfoId){
      if(this.learnersForm.get('prisonInformation').get('isReleasedFromPrisonInLastTwoYears').value != 878){
        this.learnersForm.get('prisonInformation').get('prisonLocation').setValue(this.learnersForm.get('prisonInformation').get('prisonLocation').value);
      } else{
        this.learnersForm.get('prisonInformation').get('prisonLocation').setValue(event);
      } 
    }  
  }
  
  dateRangeValidator() {  
    return (control: { value: string }) => {
      const selectedDate = this.learnersForm.get('prisonInformation').get('dateOfRelease').value; 
      if (selectedDate >= this.minDateOfRecall && selectedDate <= this.maxDateOfRecall) { 
        return { 'dateRangeError': true };
      }
      return null;
    };
  }

}


