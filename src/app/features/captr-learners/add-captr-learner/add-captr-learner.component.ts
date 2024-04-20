import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { LearnersService } from '../../learners/learners.services';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { CaptrLearnersService } from '../captr-learners.services';
import { EditCaptrLeanerSteps } from './edit-captr-learner.steps';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { ManageUsersService } from '../../manage-users/manage-users.service';
import { RegexPattern } from 'src/app/framework/constants/regex-constant';

@Component({
  selector: 'app-add-captr-learner',
  templateUrl: './add-captr-learner.component.html',
  styleUrls: ['./add-captr-learner.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class AddCaptrLearnerComponent implements OnInit, OnDestroy {
  learnersForm: FormGroup;
  unemployedFlag: any;
  maxDateOfBirth = new Date(new Date().setFullYear(new Date().getFullYear() - 16));
  minDateOfBirth = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
  currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  lrnPattern = `[a-zA-Z0-9\ ]+`;
  prnPattern = `[A-Z][0-9]{4}[A-Z]{2}`;
  namePattern = RegexPattern.namePattern;
  emailPattern = RegexPattern.email;
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
  userList:any[]=[];
  userType: number = 3;
  selectedGenderisOther: boolean;
  otherGenderPattern = `(^[a-zA-Z!#$@%()&’<>,'\"*+ /=_?\`{|}~^.-]+$)`;

  constructor(private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly editCaptrLeanerSteps: EditCaptrLeanerSteps,
    private readonly learnerService: LearnersService,
    private readonly appConfirmService: AppConfirmService,
    private readonly manageUsersService: ManageUsersService) {
    this.stepperNavigationService.stepper(this.editCaptrLeanerSteps.stepsConfig);
    this.captrLearnersService.getRefAnswer().subscribe(data => {
      this.refAnswer = data;
      this.refAnswer = this.refAnswer.filter(ref => ref.identifier !== 'PNS')

    })
    this.captrLearnersService.getUserRefDataDetails().subscribe(data => {
      this.refData = data;
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


  ngOnInit(): void {
    this.stepperNavigationService.stepper(this.editCaptrLeanerSteps.stepsConfig);
    this.initLearnersForm();
  }

  ngOnDestroy() {
    this.stepperNavigationService.stepper(null);
  }

  navigateHome() {
    this.router.navigate(['/captr-learner']);
  }

  initLearnersForm() {
    this.createLearnersForm();
    this.route.queryParams.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.isNew = false;
        this.captrLearnersService.getUserDetails(+params['id'])
          .subscribe(
            (data: any) => {
              this.learnersForm.patchValue(data);
              if(data.primaryLearnerDetails.gender == 12 ||data.primaryLearnerDetails.gender == 13){
                this.selectedGenderisOther = true;
              }
              this.learnersForm.get('contactDetails').get('emailAddress').disable();
            },
            error => {
              this.snackBarService.error(`${error.error.applicationMessage}`);
              this.navigateHome();
            }
          );
      } else {
        this.isNew = true;
        this.checkLicences();
      }
    });
  }

  createLearnersForm() {
    this.learnersForm = this.fb.group({
      primaryLearnerDetails: this.getPrimaryLearnerDetails(),
      contactDetails: this.getContactDetailsForm(),
      emergencyContact: this.getEmergencyContactForm(),
      unEmploymentStatus: this.getUnEmploymentStatusForm(),
      equalOpportunitiesMonitoring: this.getEqualOpportunitiesMonitoringForm(),
      equalityAndDiversity: this.getEqualityAndDiversityForm(),
    });
  }

  getPrimaryLearnerDetails() {
    const primaryLearnerDetailsForm = this.fb.group({
      id: [null],
      firstName: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.namePattern)]],
      lastName: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.namePattern)]],
      dateOfBirth: [null, [Validators.required]],
      gender: [null],
      niNumber: [null, [Validators.pattern(this.niNumberPattern)]],
      uln: [null, [Validators.pattern('^[0-9]{10}$'), Validators.max(9999999999), Validators.min(1000000000)]],
      isBritishNational: [null],
      isResidentOfUKorEEA: [null],
      workerId: [null],
      workerTelephoneNo:[null,  [Validators.maxLength(18),Validators.pattern(this.phoneNumberPattern)]],
      otherGender:[null, [Validators.maxLength(100),Validators.minLength(3), Validators.pattern(this.otherGenderPattern)]],
      preferredPronouns: [null]
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
    this.setNonMandatoryFieldsToNull(payload);
    this.captrLearnersService.saveNewLearners(payload).subscribe(() => {
      this.createOrUpdateLearner();
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  updateLearner() {
    const payload = this.learnersForm.getRawValue();
    
    payload.primaryLearnerDetails.dateOfBirth = Utility.transformDateToString(payload.primaryLearnerDetails.dateOfBirth);

    this.setNonMandatoryFieldsToNull(payload);
    
    this.captrLearnersService.updateLearners(payload).subscribe(() => {
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
   
    if (payload.emergencyContact.firstName === "") {
      payload.emergencyContact.firstName = null;
    }
    if (payload.emergencyContact.relationshipWithUser === "") {
      payload.emergencyContact.relationshipWithUser = null;
    }
    if (payload.emergencyContact.contactNo === "") {
      payload.emergencyContact.contactNo = null;
    }
    if(payload.primaryLearnerDetails.workerTelephoneNo === "")
    {
      payload.primaryLearnerDetails.workerTelephoneNo = null;
    }
    if (payload.primaryLearnerDetails.preferredPronouns === "") {
      payload.primaryLearnerDetails.preferredPronouns = null;
    }
  }

  createOrUpdateLearner() {
    const message = this.isNew ? 'Participant created successfully' : 'Participant updated successfully';
    this.snackBarService.success(message);
    this.router.navigate(['/captr-learner']);
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

  getFilterUserList() {
    this.manageUsersService.getFilterUserList(3).subscribe(data=>{
      data.forEach((users: any) => {
        Object.assign(users, { userFullName: users.firstName + ' ' + users.lastName });
      });
      this.userList = data;
    })
  }

  checkLicences() {

    this.manageUsersService.getValidLicences(this.userType).subscribe(data => {
      if (data.isAuthorisedLicence) {
        this.router.navigateByUrl('/captr-learner/new-learner');
      }
      else {
        this.router.navigateByUrl('/captr-learner')
        this.notAddPopup();
      }

    })
  }

  notAddPopup() {
    const dialogRef = this.appConfirmService.confirm({
      title: `Licences`,
      message: `It appears you have exceeded your user limit for this account. 
      Please contact us on support.mailbox@meganexus.com or 0207 843 4343 `,
      showOkButtonOnly: true,
      padding : '22px'
    });
    dialogRef.subscribe(result => {
      if (result) { }
    });
  }

  selectedGender(selectedGender: string) {
    if (selectedGender == 'Prefer to self-describe' || selectedGender == 'Other') {
      this.selectedGenderisOther = true;

    } else {
      this.selectedGenderisOther = false;
      this.learnersForm.get('primaryLearnerDetails').get('otherGender').reset();
    }
  }

}