import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { RegexPattern } from 'src/app/framework/constants/regex-constant';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { EditCaptrLeanerSteps } from '../../captr-learners/add-captr-learner/edit-captr-learner.steps';
import { CaptrLearnersService } from '../../captr-learners/captr-learners.services';
import { LearnersService } from '../../learners/learners.services';
import { ManageUsersService } from '../../manage-users/manage-users.service';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { MentivityService } from '../mentivity-learners.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { EditMentivityLeanerSteps } from './edit-mentivity-learner.steps';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';


export interface ListDTO {
  value: string,
}
@Component({
  selector: 'app-add-mentivity-learners',
  templateUrl: './add-mentivity-learners.component.html',
  styleUrls: ['./add-mentivity-learners.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class AddMentivityLearnersComponent implements OnInit {

  learnersForm: FormGroup;
  unemployedFlag: any;
  maxDateOfBirth = new Date(new Date().setFullYear(new Date().getFullYear() - 16));
  minDateOfBirth = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
  currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  lrnPattern = `[a-zA-Z0-9\ ]+`;
  prnPattern = `[A-Z][0-9]{4}[A-Z]{2}`;
  otherRegex = /^[a-zA-Z]([a-zA-Z0-9@' -]*[a-zA-Z0-9@' -])*?$/
  namePattern = RegexPattern.namePattern;
  emailPattern = RegexPattern.email;
  postCodePattern =
    /^(([A-Z][0-9]{1,2})|(([A-Z][A-HJ-Y][0-9]{1,2})|(([A-Z][0-9][A-Z])|([A-Z][A-HJ-Y][0-9]?[A-Z])))) [0-9][A-Z]{2}$/;
  niNumberPattern =
    /^(?!BG)(?!GB)(?!NK)(?!KN)(?!TN)(?!NT)(?!ZZ)[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}(\s?)[0-9]{2}(\s?)[0-9]{2}(\s?)[0-9]{2}(\s?)[A-D]{1}$/;
  phoneNumberPattern = /^(\d{7}|\d{11})$/;

  refAnswer: any;
  allData;
  refClientData;
  titles = ['Ms', 'Mx', 'Mrs', 'Miss', 'Mr', 'Dr', 'Prof', 'Lady', 'Sir', 'Rev', 'Lord', 'Maj',
    'Capt', 'Pte', 'Sgt', 'Ssgt', 'Lt', 'Col', 'Brig', 'Cpl', 'Lcpl', '2Lt', 'WO1', 'WO2', 'Master', 'Other', 'N/A'];

  isNew = false;
  highLevelQualificationList: any
  deactivated: boolean;
  onlyCharsPattern = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
  firstNamePattern = `([a-zA-Z]{1,})`;
  lastNamePattern = `([a-zA-Z]{1,}(\\s?|'?|-?)[a-zA-Z]{1,})`;
  refData;
  userList:any[]=[];
  userType: number = 3;
  isOtherNeed = false;
  refDataByClient
  nationalityId;
  residanceId;
  languageId;
  otherLanguageFlag;

  filterNationalityList: Observable<ListDTO[]>;
  nationalityList: ListDTO[] = [];

  filterCountryOfResidanceListList: Observable<ListDTO[]>;
  countryOfResidanceList: ListDTO[] = [];

  filterLangList: Observable<ListDTO[]>;
  langList: ListDTO[] = [];
  isotherSupportNeed: boolean =false;
  constructor(private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly mentivityService :MentivityService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly appConfirmService: AppConfirmService,
    private readonly manageUsersService: ManageUsersService,
    private readonly inPageNavService: InPageNavService,
    private readonly editMentivityLeanerSteps: EditMentivityLeanerSteps) {

      this.stepperNavigationService.stepper(this.editMentivityLeanerSteps.stepsConfig);
      this.inPageNavService.setNavItems(this.editMentivityLeanerSteps.stepsConfig);

      this.mentivityService.getRefDataAllDetails().subscribe(data => {
        this.allData = data;
        this.nationalityList = this.allData.refDataMap.Nationality;
        this.countryOfResidanceList = this.allData.refDataMap.Country;
        this.langList = this.allData.refDataMap.Language_Choice;
      })

    this.captrLearnersService.getRefAnswer().subscribe(data => {
      this.refAnswer = data;
      this.refAnswer = this.refAnswer.filter(ref => ref.identifier !== 'PNS')

    })
 
    
    
    this.captrLearnersService.getUserRefDataDetails().subscribe(data => {
      this.refData = data;
    })

    this.mentivityService.getUserRefDataByCLientId().subscribe(data => {
      this.refDataByClient = data;
    })

    this.getFilterUserList();
    }


  showUnEmploymentStatusField(form, control) {
    if (this.learnersForm.get(form).get(control)?.value === 1) {
      return true;
    }
    else if (this.learnersForm.get(form).get(control)?.value === 2 || this.learnersForm.get(form).get(control)?.value === null) {
      this.resetValues(form, control);
      return false;
    }
    else {
      return false;
    }
  }

  
  resetValues(form, control) {
    if (form === 'equalOpportunitiesMonitoring') {
      if (control === 'disabilityOrLearningDifficultyId') {
        this.learnersForm.get(form).get('disabilityOrLearningDifficultyIds').reset()
      }
      if (control === 'isMedicalCondition') {
        this.learnersForm.get(form).get('medicalCondition').reset()
      }
      if (control === 'isSupportToLiteracy') {
        this.learnersForm.get(form).get('literacySupport').reset()
      }
      if (control === 'isCareerRequirements') {
        this.learnersForm.get(form).get('careerRequirements').reset()
      }
      if (control === 'isMotivationOfselfEsteem') {
        this.learnersForm.get(form).get('motivationOfselfEsteem').reset()
      }
      if (control === 'isCriminalConvictions') {
        this.learnersForm.get(form).get('criminalConvictions').reset()
      }
    }
    if (form === 'equalityAndDiversity') {
      this.learnersForm.get(form).get('caringResposibilities').reset();
      this.learnersForm.get(form).get('householdSituation').reset();
      this.learnersForm.get(form).get('marriedOrCivilParnership').reset();
      this.learnersForm.get(form).get('religionOrbeliefs').reset();
      this.learnersForm.get(form).get('otherReligionOrBeliefs').reset();
      this.learnersForm.get(form).get('sexualOrientation').reset();
      this.learnersForm.get(form).get('otherSexualOrientation').reset();
      this.learnersForm.get(form).get('ethnicity').reset();
      this.learnersForm.get(form).get('otherEthnicity').reset();

    }
    if (form === 'unEmploymentStatus') {
      this.learnersForm.get(form).get('lengthOfUnemployment').reset();
      this.learnersForm.get(form).get('jobCentreLocation').reset();
      this.learnersForm.get(form).get('workCoach').reset();
      this.learnersForm.get(form).get('benefitType').reset();
    }
  }

  otherReligionOrBeliefsReset() {
    if (this.learnersForm.get('equalityAndDiversity').get('religionOrbeliefs').value === 11) {
      return true;
    }
    else {
      this.learnersForm.get('equalityAndDiversity').get('otherReligionOrBeliefs').reset();
      return false;
    }
  }

  otherSexualOrientationReset() {
    if (this.learnersForm.get('equalityAndDiversity').get('sexualOrientation').value === 6) {
      return true;
    }
    else {
      this.learnersForm.get('equalityAndDiversity').get('otherSexualOrientation').reset();
      return false;
    }
  }
//value change
  otherEthnicityReset(){
    if (this.learnersForm.get('equalityAndDiversity').get('ethnicity').value === 74) {
      return true;
    }
    else {
      this.learnersForm.get('equalityAndDiversity').get('otherEthnicity').reset();
      return false;
    }
  }

  otherGenderReset(){
    if ((this.learnersForm.get('primaryLearnerDetails').get('gender').value === 12) || 
    (this.learnersForm.get('primaryLearnerDetails').get('gender').value === 13) ) {
      return true;
    }
    else {
      this.learnersForm.get('primaryLearnerDetails').get('otherGender').reset();
      return false;
    }
  }

  ngOnInit(): void {
    this.stepperNavigationService.stepper(this.editMentivityLeanerSteps.stepsConfig);
    console.log(this.allData,'all data')
    this.initLearnersForm();
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
    this.stepperNavigationService.stepper(null);
  }

  navigateHome() {
    this.router.navigate(['/mentivity-learner']);
  }

  initLearnersForm() {
    this.createLearnersForm();
    this.route.queryParams.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.isNew = false;
        this.mentivityService.getUserDetails(+params['id'])
          .subscribe(
            (data: any) => {
              this.learnersForm.patchValue(data);
              this.learnersForm.get('contactDetails').get('emailAddress').disable();
              if(data.primaryLearnerDetails.nationality){
               const refData:any = this.nationalityList.filter((x:any) => x.id == data.primaryLearnerDetails.nationality);
               this.learnersForm.controls['primaryLearnerDetails'].get('nationality').setValue(refData[0].description); 
               this.nationalityId = data.primaryLearnerDetails.nationality;
              }
              if(data.primaryLearnerDetails.countryOfResidance){
                const refData:any = this.countryOfResidanceList.filter((x:any) => x.id == data.primaryLearnerDetails.countryOfResidance);
                this.learnersForm.controls['primaryLearnerDetails'].get('countryOfResidance').setValue(refData[0].description); 
                this.residanceId = data.primaryLearnerDetails.countryOfResidance;
              }
              if(data.primaryLearnerDetails.selectedLanguage){
                const refData:any = this.langList.filter((x:any) => x.id == data.primaryLearnerDetails.selectedLanguage);
                this.learnersForm.controls['primaryLearnerDetails'].get('selectedLanguage').setValue(refData[0].description);
                this.languageId = data.primaryLearnerDetails.selectedLanguage;
              }
              if(data.primaryLearnerDetails.otherLanguage){
                this.otherLanguageFlag=true;
              }

              const selectedValues =  this.learnersForm.controls['primaryLearnerDetails'].get('personNeed').value;
              if(selectedValues.includes(518))
              {
                this.isOtherNeed = true;
              }

              let selectedNeed = this.learnersForm.get('primaryLearnerDetails').get('youngPersonSupportNeeds').value;
              if(selectedNeed!=null && selectedNeed.includes(541))
              {
                this.isotherSupportNeed = true;
              }
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

  createLearnersForm() {
    this.learnersForm = this.fb.group({
      primaryLearnerDetails: this.getPrimaryLearnerDetails(),
      contactDetails: this.getContactDetailsForm(),
      emergencyContact: 
      this.fb.array([
        this.fb.group({
          id: [null],
          firstName: [null, [Validators.required,Validators.maxLength(100), Validators.pattern(this.namePattern)]],
          contactNo: [null, [Validators.required,Validators.pattern(this.phoneNumberPattern)]],
          relationshipWithUser: [null, [Validators.required,Validators.pattern(this.onlyCharsPattern), Validators.maxLength(100), Validators.minLength(1)]],
          isPrimary : [true],
          postCode: [null, [Validators.required, Validators.pattern(this.postCodePattern)]],
          addressLine1: [null, [Validators.required,Validators.maxLength(100), Validators.minLength(3)]],
          addressLine2: [null, [Validators.required,Validators.maxLength(100), Validators.minLength(3)]],
          townOrCity: [null, [Validators.required,Validators.maxLength(100), Validators.pattern(this.onlyCharsPattern), Validators.minLength(3)]],    
        }),
        this.fb.group({
          id: [null],
          firstName: [null, [Validators.maxLength(100), Validators.pattern(this.namePattern)]],
          contactNo: [null, [Validators.pattern(this.phoneNumberPattern)]],
          relationshipWithUser: [null, [Validators.pattern(this.onlyCharsPattern), Validators.maxLength(100), Validators.minLength(1)]],
          isPrimary : [false],
          postCode: [null, [ Validators.pattern(this.postCodePattern)]],
          addressLine1: [null, [Validators.maxLength(100), Validators.minLength(3)]],
          addressLine2: [null, [Validators.maxLength(100), Validators.minLength(3)]],
          townOrCity: [null, [Validators.maxLength(100), Validators.pattern(this.onlyCharsPattern), Validators.minLength(3)]],    
        })
       ]),
      unEmploymentStatus: this.getUnEmploymentStatusForm(),
      equalOpportunitiesMonitoring: this.getEqualOpportunitiesMonitoringForm(),
      equalityAndDiversity: this.getEqualityAndDiversityForm(),
    });
    
  this.filterNationalityList = this.learnersForm.get('primaryLearnerDetails').get('nationality').valueChanges
  .pipe(
    startWith(''),
    map(value => this._filter(value)),
    map(filteredValues => this.customSort(filteredValues, 'description'))
  );
  this.filterCountryOfResidanceListList = this.learnersForm.get('primaryLearnerDetails').get('countryOfResidance').valueChanges
  .pipe(
    startWith(''),
    map(value => this._filterResidance(value))
  );
  this.filterLangList = this.learnersForm.get('primaryLearnerDetails').get('selectedLanguage').valueChanges
  .pipe(
    startWith(''),
    map(value => this._filterLang(value))
  );
}
private customSort(values: ListDTO[], property: string): ListDTO[] {
  console.log(values);
  return values.sort((a, b) => a[property].localeCompare(b[property]));
}

  getPrimaryLearnerDetails() {
    const primaryLearnerDetailsForm = this.fb.group({
      id: [null],
      firstName: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.namePattern)]],
      lastName: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.namePattern)]],
      dateOfBirth: [null, [Validators.required]],
      gender: [null],
      otherGender: [null,[Validators.pattern(this.otherRegex),Validators.maxLength(100), Validators.minLength(3)]],
      niNumber: [null, [Validators.pattern(this.niNumberPattern)]],
      uln: [null, [Validators.pattern('^[0-9]{10}$'), Validators.max(9999999999), Validators.min(1000000000)]],
      nationality: [null],
      countryOfResidance: [null],
      isEnglishLanguage:[null], 
      selectedLanguage:[null],
      otherLanguage:[null,[Validators.pattern(this.otherRegex),Validators.maxLength(100), Validators.minLength(3)]],
      isPersonEHCU:[null],
      personNeed:[null],
      otherNeed:[null,[Validators.pattern(this.otherRegex),Validators.maxLength(100), Validators.minLength(3)]],
      workerId: [null],
      workerTelephoneNo:[null,  [Validators.maxLength(18),Validators.pattern(this.phoneNumberPattern)]],
      youngPersonSupportNeeds: [null],
      otheryoungPersonSupportNeeds: [null,[Validators.pattern(this.otherRegex),Validators.maxLength(100),Validators.minLength(3)]],
    })
    
    return primaryLearnerDetailsForm;
  }

  getEqualityAndDiversityForm() {
    const equalityAndDiversityForm = this.fb.group({
      id: [null],
      isEqualityAndDiversityInformationId: [null],
      caringResposibilities: [null],
      householdSituation: [null],
      marriedOrCivilParnership: [null],
      religionOrbeliefs: [null],
      otherReligionOrBeliefs: [null, [Validators.maxLength(100), Validators.minLength(3)]],
      sexualOrientation: [null],
      otherSexualOrientation: [null, [Validators.maxLength(100), Validators.minLength(3)]],
      ethnicity: [null],
      otherEthnicity:[null, [Validators.pattern(this.otherRegex),Validators.maxLength(100), Validators.minLength(3)]],
      workingpattern: [null],
      flexibility: [null],
    });
    return equalityAndDiversityForm;
  }

  getUnEmploymentStatusForm() {
    const unEmploymentStatusForm = this.fb.group({
      id: [null],
      isLookingForWork: [null],
      lengthOfUnemployment: [null],
      jobCentreLocation: [null, [Validators.maxLength(50), Validators.minLength(3)]],
      workCoach: [null, [Validators.maxLength(50), Validators.minLength(1)]],
      benefitType: [null],
    })
    return unEmploymentStatusForm;
  }

  getEqualOpportunitiesMonitoringForm() {
    const equalOpportunitiesMonitoringForm = this.fb.group({
      id: [null],
      disabilityOrLearningDifficultyId: [null],
      disabilityOrLearningDifficultyIds: [null],
      isMedicalCondition: [null],
      medicalCondition: [null, [Validators.maxLength(100), Validators.minLength(3)]],
      isSupportToLiteracy: [null],
      literacySupport: [null, [Validators.maxLength(100), Validators.minLength(3)]],
      isCareerRequirements: [null],
      careerRequirements: [null, [Validators.maxLength(100), Validators.minLength(3)]],
      isMotivationOfselfEsteem: [null],
      motivationOfselfEsteem: [null, [Validators.maxLength(100), Validators.minLength(3)]],
      isCriminalConvictions: [null],
      criminalConvictions: [null, [Validators.maxLength(300), Validators.minLength(3)]],
    })
    return equalOpportunitiesMonitoringForm;
  }

  getDisabilityOrLearningDifficultiesForm() {
    const disabilityOrLearningDifficultiesForm = this.fb.group({
      id: [null],
      disabilityOrLearningDifficulty: [null],
    })
    return disabilityOrLearningDifficultiesForm;
  }

  getContactDetailsForm() {
    const contactDetailsForm = this.fb.group({
      id: [null],
      addressLine1: [null, [Validators.maxLength(100), Validators.minLength(3)]],
      addressLine2: [null, [Validators.maxLength(100), Validators.minLength(3)]],
      townOrCity: [null, [Validators.maxLength(100), Validators.pattern(this.onlyCharsPattern), Validators.minLength(3)]],
      county: [null, [Validators.maxLength(100), Validators.pattern(this.onlyCharsPattern), Validators.minLength(3)]],
      postCode: [null, [ Validators.pattern(this.postCodePattern)]],
      emailAddress: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.emailPattern)]],
      contactNo: [null, Validators.pattern(this.phoneNumberPattern)],
      addressTenureInMonth: [null, [Validators.max(11), Validators.min(0), Validators.pattern("^[0-9]*$")]],
      addressTenureInyear: [null, [Validators.max(100), Validators.min(0), Validators.pattern("^[0-9]*$")]],
    })
    return contactDetailsForm;

  }

  errorCommonMethod(error) {
    if (error.error.errors) {
      this.snackBarService.error(`${error.error.errors[0].errorMessage}`);
    } else {
      this.snackBarService.error(`${error.error.applicationMessage}`);
    }
  }

  onSubmit() {
    this.isNew ? this.createLearner() : this.updateLearner();
  }

  createLearner() {
    const payload = this.learnersForm.getRawValue(); 
    payload.primaryLearnerDetails.dateOfBirth = Utility.transformDateToString(payload.primaryLearnerDetails.dateOfBirth);
    payload.primaryLearnerDetails.nationality =this.nationalityId;
    payload.primaryLearnerDetails.countryOfResidance =this.residanceId;
    payload.primaryLearnerDetails.selectedLanguage =this.languageId;
    this.setNonMandatoryFieldsToNull(payload);
    console.log(payload)
    this.mentivityService.saveNewLearners(payload).subscribe(() => {
      this.createOrUpdateLearner();
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  updateLearner() {
    const payload = this.learnersForm.getRawValue();
    payload.primaryLearnerDetails.nationality =this.nationalityId;
    payload.primaryLearnerDetails.countryOfResidance =this.residanceId;
    payload.primaryLearnerDetails.selectedLanguage =this.languageId;
    payload.primaryLearnerDetails.dateOfBirth = Utility.transformDateToString(payload.primaryLearnerDetails.dateOfBirth);
    this.setNonMandatoryFieldsToNull(payload);
    this.mentivityService.updateLearners(payload).subscribe(() => {
      this.createOrUpdateLearner();
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  setNonMandatoryFieldsToNull(payload){
    if (payload.primaryLearnerDetails.niNumber === "") {
      payload.primaryLearnerDetails.niNumber = null;
    }
    if (payload.primaryLearnerDetails.uln === "") {
      payload.primaryLearnerDetails.uln = null;
    }
    if (payload.contactDetails.addressLine1 === "") {
      payload.contactDetails.addressLine1 = null;
    }
    if (payload.contactDetails.addressLine2 === "") {
      payload.contactDetails.addressLine2 = null;
    }
    if (payload.contactDetails.contactNo === "") {
      payload.contactDetails.contactNo = null;
    }
    if (payload.contactDetails.postCode === "") {
      payload.contactDetails.postCode = null;
    }
    if (payload.contactDetails.townOrCity === "") {
      payload.contactDetails.townOrCity = null;
    }
    if (payload.contactDetails.county === "") {
      payload.contactDetails.county = null;
    }
    if(payload.primaryLearnerDetails.workerTelephoneNo === "")
    {
      payload.primaryLearnerDetails.workerTelephoneNo = null;
    }
  }

  createOrUpdateLearner() {
    const message = this.isNew ? 'Participant created successfully' : 'Participant updated successfully';
    this.snackBarService.success(message);
    this.router.navigate(['/mentivity-learner']);
  }


  getFormByName(formName) {
    return this.learnersForm.get(formName) as FormGroup
  }

  getFilterUserList() {
    this.manageUsersService.getFilterUserList(10).subscribe(data=>{
      data.forEach((users: any) => {
        Object.assign(users, { userFullName: users.firstName + ' ' + users.lastName });
      });
      this.userList = data;
    })
  }

  get emergencyContact(): FormArray {
    return this.learnersForm.get('emergencyContact') as FormArray;
  }


  showLanguageList(form, control)
  {
    if (this.learnersForm.get(form).get(control)?.value === 2) {
      return true;
    }
    else if (this.learnersForm.get(form).get(control)?.value === 1 || this.learnersForm.get(form).get(control)?.value === null) {
      this.resetValues(form, control);
      this.learnersForm.get('primaryLearnerDetails').get('selectedLanguage').reset();
      return false;
    }
    else {
      return false;
    }
  }
  
  otherLanguageguageReset(event){
    if ((this.learnersForm.get('primaryLearnerDetails').get('selectedLanguage').value === 508) ) 
    {     
      this.otherLanguageFlag=true;    
    }
    else {
      this.learnersForm.get('primaryLearnerDetails').get('otherLanguage').reset();
      this.otherLanguageFlag=false;     
    }
  }
  
  showEHCPList(form,control){
    if (this.learnersForm.get(form).get(control)?.value === 1) {
      return true;
    }
    else if (this.learnersForm.get(form).get(control)?.value === 2 || this.learnersForm.get(form).get(control)?.value === null) {
      this.resetValues(form, control);
       this.learnersForm.get('primaryLearnerDetails').get('personNeed').reset();
       this.learnersForm.get('primaryLearnerDetails').get('otherNeed').reset();

      return false;
    }
    else {
      return false;
    }
  }
//id should be change
  otherNeedReset(event){
   const selectedValues =  this.learnersForm.controls['primaryLearnerDetails'].get('personNeed').value;
  
   if(selectedValues.includes(518)){
            this.isOtherNeed =  true;
          }else{
            this.learnersForm.get('primaryLearnerDetails').get('otherNeed').clearValidators();
            this.learnersForm.get('primaryLearnerDetails').get('otherNeed').reset();
            this.isOtherNeed =false;
          }
  
  }
  
resetfield(event,control){
  if(event == null && control == 'otherNeed'){
    this.learnersForm.get('primaryLearnerDetails').get(control).reset();
    this.isOtherNeed =false;
  }else if(event == null && control == 'otherLanguage'){
    this.otherLanguageFlag=false; 
    this.learnersForm.get('primaryLearnerDetails').get(control).clearValidators();
    this.learnersForm.get('primaryLearnerDetails').get(control).reset();
    this.learnersForm.get('primaryLearnerDetails').get('selectedLanguage').reset();
  }else if(event == 1 && control == 'otherLanguage'){
    this.learnersForm.get('primaryLearnerDetails').get(control).clearValidators();
    this.learnersForm.get('primaryLearnerDetails').get(control).reset();
    this.otherLanguageFlag=false; 
  }else if(event == 2 && control == 'otherNeed'){
    this.learnersForm.get('primaryLearnerDetails').get(control).clearValidators();
    this.learnersForm.get('primaryLearnerDetails').get(control).reset();
    this.isOtherNeed=false; 
  }

}
  
onOptionSelectd(option: any) {
  this.nationalityId = option.id;
}

private _filter(value: string): ListDTO[] {
  if(!value) {
    return this.nationalityList;
  }
  const regex = new RegExp(value, 'i');  
 return  this.nationalityList.filter((option: any) =>regex.test(option?.description));  
}

onOptionSelectdResidance(option: any) {
  this.residanceId = option.id;
}

private _filterResidance(value: string): ListDTO[] {
  if(!value) {
    return this.countryOfResidanceList;
  }
  const regex = new RegExp(value, 'i');  
  return  this.countryOfResidanceList.filter((option: any) =>regex.test(option?.description));  
}

onOptionSelectdLang(option: any) {
  this.languageId = option.id;
  if (this.languageId === 508) 
  {     
    this.otherLanguageFlag=true;    
  }
  else {
    this.learnersForm.get('primaryLearnerDetails').get('otherLanguage').clearValidators();
    this.learnersForm.get('primaryLearnerDetails').get('otherLanguage').reset();
    this.otherLanguageFlag=false;     
  }
}

private _filterLang(value: string): ListDTO[] {
  if(!value) {
    return this.langList;
  }
  const regex = new RegExp(value, 'i');  
  return  this.langList.filter((option: any) =>regex.test(option?.description));   
}
othersuportNeedReset(value) {
  const selectedValues = this.learnersForm.controls['primaryLearnerDetails'].get('youngPersonSupportNeeds').value;

  if (selectedValues) {
    const otherField = selectedValues.filter(x=> x == 541);
     if(otherField.length == 1){
      this.isotherSupportNeed = true
     }else{
      this.learnersForm.controls['primaryLearnerDetails'].get('otheryoungPersonSupportNeeds').clearValidators();
      this.learnersForm.controls['primaryLearnerDetails'].get('otheryoungPersonSupportNeeds').reset();
      this.isotherSupportNeed = false;
     }
  }
}

}