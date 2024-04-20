import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utility } from 'src/app/framework/utils/utility';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../framework/components/date-adapter/date-adapter';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { LearnersService } from '../learners.services';
import { EditLeanerSteps } from './edit-learner.steps';

@Component({
  selector: 'app-add-learner',
  templateUrl: './add-learner.component.html',
  styleUrls: ['./add-learner.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class AddLearnerComponent implements OnInit, OnDestroy {
  learnersForm: FormGroup;
  unemployedFlag: any;
  maxDateOfBirth = new Date(new Date().setFullYear(new Date().getFullYear() - 19));
  minDateOfBirth = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
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

  constructor(private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly learnersService: LearnersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stepperNavigationService:StepperNavigationService,
    private readonly editLeanerSteps: EditLeanerSteps) 
    {
      this.stepperNavigationService.stepper(this.editLeanerSteps.stepsConfig);
    this.learnersService.getRefAnswer().subscribe(data => {
      this.refAnswer = data;
      this.refAnswer = this.refAnswer.filter(ref => ref.identifier !== 'PNS')

    })
    this.learnersService.getUserRefDataDetails().subscribe(data => {
      this.refData = data;
    })
  }

  showUnEmploymentStatusField(form, control) {
    if (this.learnersForm.get(form).get(control)?.value === 1) {
      // this.learnersForm.get(form).get(control).patchValue(1)
      return true;
    }
    else if (this.learnersForm.get(form).get(control)?.value === 2){
      // this.learnersForm.get(form).get(control).patchValue(2)
      this.resetValues(form, control);
      return false;
    }
    else {
      this.resetValues(form, control);
      return false;
    }
  }

  resetValues(form, control) {
    if (form === 'equalOpportunitiesMonitoring') {

      switch (control) {

        case 'disabilityOrLearningDifficultyId':
          this.learnersForm.get(form).get('disabilityOrLearningDifficultyIds').reset();
          this.learnersForm.get(form).get('disabilityOrLearningDifficultyIds').clearValidators();
          this.learnersForm.get(form).get('disabilityOrLearningDifficultyIds').updateValueAndValidity();
          break;

        case 'isMedicalCondition':
          this.learnersForm.get(form).get('medicalCondition').reset();
          this.learnersForm.get(form).get('medicalCondition').clearValidators();
          this.learnersForm.get(form).get('medicalCondition').updateValueAndValidity();
          break;

        case 'isSupportToLiteracy':
          this.learnersForm.get(form).get('literacySupport').reset();
          this.learnersForm.get(form).get('literacySupport').clearValidators();
          this.learnersForm.get(form).get('literacySupport').updateValueAndValidity();
          break;

        case 'isCareerRequirements':
          this.learnersForm.get(form).get('careerRequirements').reset();
          this.learnersForm.get(form).get('careerRequirements').clearValidators();
          this.learnersForm.get(form).get('careerRequirements').updateValueAndValidity();
          break;

        case 'isMotivationOfselfEsteem':
          this.learnersForm.get(form).get('motivationOfselfEsteem').reset();
          this.learnersForm.get(form).get('motivationOfselfEsteem').clearValidators();
          this.learnersForm.get(form).get('motivationOfselfEsteem').updateValueAndValidity();
          break;

        case 'isCriminalConvictions':
          this.learnersForm.get(form).get('criminalConvictions').reset();
          this.learnersForm.get(form).get('criminalConvictions').clearValidators();
          this.learnersForm.get(form).get('criminalConvictions').updateValueAndValidity();
          break;

        default:
          break;
      }
    }
    if (form === 'equalityAndDiversity') {
      let optionalFieldArray = [
        'caringResposibilities', 'householdSituation', 'marriedOrCivilParnership',
        'religionOrbeliefs', 'otherReligionOrBeliefs', 'sexualOrientation',
        'otherSexualOrientation', 'ethnicity'
      ]

      optionalFieldArray.forEach(element => {
        this.learnersForm.get(form).get(element).reset();
        this.learnersForm.get(form).get(element).clearValidators();
        this.learnersForm.get(form).get(element).updateValueAndValidity();
      })
    }
    if (form === 'unEmploymentStatus') {
      let optionalFieldArray = ['lengthOfUnemployment','jobCentreLocation','workCoach','benefitType']
      optionalFieldArray.forEach(element=>{
        this.learnersForm.get(form).get(element).reset();
        this.learnersForm.get(form).get(element).clearValidators();
      this.learnersForm.get(form).get(element).updateValueAndValidity();
      })
      }
  }

  otherReligionOrBeliefsReset() {
    if (this.learnersForm.get('equalityAndDiversity').get('religionOrbeliefs').value === 11) {
      return true;
    }
    else {
      this.learnersForm.get('equalityAndDiversity').get('otherReligionOrBeliefs').reset();
      this.learnersForm.get('equalityAndDiversity').get('otherReligionOrBeliefs').clearValidators();
      this.learnersForm.get('equalityAndDiversity').get('otherReligionOrBeliefs').updateValueAndValidity();
      return false;
    }
  }

  otherSexualOrientationReset() {
    if (this.learnersForm.get('equalityAndDiversity').get('sexualOrientation').value === 6) {
      return true;
    }
    else {
      this.learnersForm.get('equalityAndDiversity').get('otherSexualOrientation').reset();
      this.learnersForm.get('equalityAndDiversity').get('otherSexualOrientation').clearValidators();
      this.learnersForm.get('equalityAndDiversity').get('otherSexualOrientation').updateValueAndValidity();
      return false;
    }
  }


  ngOnInit(): void {
    this.stepperNavigationService.stepper(this.editLeanerSteps.stepsConfig);
    this.initLearnersForm();
  }

  ngOnDestroy() {
    this.stepperNavigationService.stepper(null);
  }

  navigateHome() {
    this.router.navigate(['./learners']);
  }

  initLearnersForm() {
    this.createLearnersForm();
    this.route.queryParams.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.isNew = false;
        this.learnersService.getUserDetails(+params['id'])
          .subscribe(
            (data: any) => {
              this.learnersForm.patchValue(data);
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
      id: [null],
      firstName: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.namePattern)]],
      lastName: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.namePattern)]],
      dateOfBirth: [null, [Validators.required]],
      gender: [null],
      niNumber: [null, [Validators.pattern(this.niNumberPattern)]],
      uln: [null, [Validators.pattern('^[0-9]{10}$'), Validators.max(9999999999), Validators.min(1000000000)]],
      highestLevelQualification: [null],
      isBritishNational: [null,],
      isResidentOfUKorEEA: [null,],
      isValidDrivingLicence: [null,],
      isOwnCarDriver: [null,],
      hiVisSize: [null,],
      trouserWaistSize: [null,],
      shoeSize: [null,],
      contactDetails: this.getContactDetailsForm(),
      emergencyContact: this.getEmergencyContactForm(),
      unEmploymentStatus: this.getUnEmploymentStatusForm(),
      equalOpportunitiesMonitoring: this.getEqualOpportunitiesMonitoringForm(),
      equalityAndDiversity: this.getEqualityAndDiversityForm(),
    });
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
      workingpattern: [null],
      flexibility: [null],
    })
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
      postCode: [null, [Validators.pattern(this.postCodePattern)]],
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
    payload.dateOfBirth = Utility.dateToString(payload.dateOfBirth);
    this.learnersService.saveNewLearners(payload).subscribe(() => {
      this.createOrUpdateLearner();
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  updateLearner() {
    const payload = this.learnersForm.getRawValue();
      
    payload.dateOfBirth = Utility.dateToString(payload.dateOfBirth);

    if (payload.niNumber === "") {
      payload.niNumber = null;
    }
    if (payload.uln === "") {
      payload.uln = null;
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
    if (payload.contactDetails.addressTenureInMonth === "") {
      payload.contactDetails.addressTenureInMonth = null;
    }
    if (payload.contactDetails.addressTenureInyear === "") {
      payload.contactDetails.addressTenureInyear = null;
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
   
    if (payload.emergencyContact.firstName === "") {
      payload.emergencyContact.firstName = null;
    }
    if (payload.emergencyContact.relationshipWithUser === "") {
      payload.emergencyContact.relationshipWithUser = null;
    }
    if (payload.emergencyContact.contactNo === "") {
      payload.emergencyContact.contactNo = null;
    }
    this.learnersService.updateLearners(payload).subscribe(() => {
      this.createOrUpdateLearner();
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  createOrUpdateLearner() {
    const message = this.isNew ? 'Learner created successfully' : 'Learner updated successfully';
    this.snackBarService.success(message);
    this.router.navigate(['./learners']);

  }


  getEmergencyContactForm() {
    const emergencyContForm = this.fb.group({
      id: [null],
      firstName: [null, [Validators.maxLength(100), Validators.pattern(this.namePattern)]],
      contactNo: [null, [Validators.pattern(this.phoneNumberPattern)]],
      relationshipWithUser: [null, [Validators.pattern(this.onlyCharsPattern), Validators.maxLength(100), Validators.minLength(1)]]
    })
    return emergencyContForm;

  }

  getFormByName(formName) {
    return this.learnersForm.get(formName) as FormGroup
  }

}
