import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ManageUsersService } from '../../manage-users/manage-users.service';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { ParticipantV2Service } from '../participant-v2.service';
import { EditParticipantSteps } from './edit-participant-learner.steps';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddPreviousQualificationPopComponent } from './add-previous-qualification-pop/add-previous-qualification-pop.component';
import { ToWardsQualificanPopUpComponent } from './to-wards-qualification-pop-up/to-wards-qualifican-pop-up.component';
import { ConfirmService } from '../../shared/components/confirm-box/confirm-box.service';

export interface boroughsNameList {
  value: string,
}
@Component({
  selector: 'app-add-participant',
  templateUrl: './add-participant.component.html',
  styleUrls: ['./add-participant.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class AddParticipantComponent implements OnInit, OnDestroy {
  personSupportedForm: FormGroup;
  unemployedFlag: any;
  maxDateOfBirth = new Date(new Date().setFullYear(new Date().getFullYear() - 16));
  minDateOfBirth = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
  maxDateOFJoinedUnityWork = new Date(new Date().setFullYear(new Date().getFullYear()));
  minDateOFJoinedUnityWork = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
  maxDateOFReferraldate = new Date(new Date().setFullYear(new Date().getFullYear()));
  minDateOFReferraldate = new Date(new Date().setFullYear(new Date().getFullYear() - 100));

  currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  lrnPattern = `[a-zA-Z0-9\ ]+`;
  prnPattern = `[A-Z][0-9]{4}[A-Z]{2}`;
  namePattern = `[^0-9\\r\\n\\t|\"]+$`;
  emailPattern = /^[a-z0-9._%+'-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  postCodePattern = /^(([a-zA-Z][0-9]{1,2})|(([a-zA-Z][a-hj-yA-HJ-Y][0-9]{1,2})|(([a-zA-Z][0-9][a-zA-Z])|([a-zA-Z][a-hj-yA-HJ-Y][0-9]?[a-zA-Z])))) [0-9][a-zA-Z]{2}$/;
  niNumberPattern = /^(?!BG)(?!GB)(?!NK)(?!KN)(?!TN)(?!NT)(?!ZZ)[a-zA-CEGHJ-PQR-TW-Z]{1}[a-ceghj-npqr-tw-z]{1}(\s?)[0-9]{2}(\s?)[0-9]{2}(\s?)[0-9]{2}(\s?)[a-d]{1}$/i;
  phoneNumberPattern = /^(\d{7}|\d{11})$/;
  ethnicityRefData;
  refAnswer: any;
  titles = ['Ms', 'Mx', 'Mrs', 'Miss', 'Mr', 'Dr', 'Prof', 'Lady', 'Sir', 'Rev', 'Lord', 'Maj',
    'Capt', 'Pte', 'Sgt', 'Ssgt', 'Lt', 'Col', 'Brig', 'Cpl', 'Lcpl', '2Lt', 'WO1', 'WO2', 'Master', 'Other', 'N/A'];
  isNew = false;
  genderList: any;
  highLevelQualificationList: any
  deactivated: boolean;
  showInputTextForGender: boolean = false;
  ethnicityList
  onlyCharsPattern = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
  firstNamePattern = `([a-zA-Z]{1,})`;
  lastNamePattern = `([a-zA-Z]{1,}(\\s?|'?|-?)[a-zA-Z]{1,})`;
  refData;
  userList: any[] = [];
  userType: number = 3;
  jobCheck: boolean = false;
  job2Value = [];
  job1Value: number;
  selectedEthnicity: string | null = null;
  boroughsList: boroughsNameList[] = [];
  filteredboroughsList: Observable<boroughsNameList[]>;
  selectedEmpId: any;
  primaryProgramsList;
  statusYesNo;
  disabilitiesList;
  healthCondtionList;
  mentalHealthList;
  knowThemList;
  PreferredContactMethodList;
  multipleValueOrOtherFeild: boolean = false
  healthConditionOtherFeild: boolean = false
  mentalHelthOrOtherFeildSelected: boolean = false
  userId;
  jobSectorInterested
  flag: Boolean = true;
  displayedColumns: string[] = ['qualificationName', 'qualificationLevel', 'qualificationStartDate', 'qualificationDateAchived', 'actions'];
  towardsQualificationDisplayedColumns: string[] = ['qualificationName', 'qualificationStartDate', 'qualificationDateAchived', 'actions'];
  statsForeducationAndLearning
  dataSource: any = new MatTableDataSource<any>();
  dataSource1: any = new MatTableDataSource<any>();
  dataSource2: any = new MatTableDataSource<any>();
  previousQualifications: any[] = [];
  toWardsQualificationDone: any[] = [];
  toWardQualificationProgress: any[] = [];
  towardsQualifications: any[] = [];
  previousQualificationAsSelected: Boolean = false
  toWardsQualificationAsSelected: Boolean = false
  showQualificationTable: any;
  updatedStatus: Boolean = true
  jobCheck1: boolean = false;
  jobCheck2: boolean = false;
  jobCheck3: boolean = false;
  personTypeData: any[] = [];
  supportedProgramData: any[] = [];
  socialEnterpriseData: any[] = [];
  selectedPersonTypes: any[] = [];
  selectedSupportedProgramData: any[] = [];
  selectedSocialEnterpriseData: any[] = [];
  boroughId: any;
  keyValueMapOfPersonType = {};
  keyValueMapOfProgrammeType = {};
  keyValueMapOfContractType = {};
  persontyese='';
  contracts='';
  contractsCheck: boolean = false;
  constructor(
    private readonly fb: FormBuilder,
    private readonly participantV2Service: ParticipantV2Service,
    private readonly manageUsersService: ManageUsersService,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly editParticipantSteps: EditParticipantSteps,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly appConfirmService: AppConfirmService,
    private readonly dialog: MatDialog,
    private readonly cdRef: ChangeDetectorRef,
    private readonly confirm: ConfirmService,

  ) {
    this.stepperNavigationService.stepper(this.editParticipantSteps.stepsConfig);
    this.participantV2Service.getRefDataForPersonSupported().subscribe(data => {
      this.refData = data;
      this.boroughsList = data.boroughs;
      this.primaryProgramsList = data.programs.filter(ref => ref.identifier !== '6')
    })

    this.participantV2Service.getRefAnswer().subscribe(data => {
      this.refAnswer = data;
      this.refAnswer = this.refAnswer.filter(ref => ref.identifier !== 'PNS')
    })
    this.getRefDataForHelthAndDesability();
    this.getFilterUserList();
  }

  ngOnInit(): void {
    this.stepperNavigationService.stepper(this.editParticipantSteps.stepsConfig);
    this.initPersonSupportedForm();
    this.getPersonTypeData();
  }

  initPersonSupportedForm() {
    this.createPersonSupportedForm();
    this.route.queryParams.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.userId = +params['id'];
        this.isNew = false;
        this.participantV2Service.getUserDetails(+params['id'])
          .subscribe(
            (data: any) => {
              this.job2Value = data.participantV2Details.additionalProgramsList
              this.job1Value = data.participantV2Details.programId;
              this.boroughId=data.participantV2Details.boroughId;
              this.personSupportedForm.patchValue(data);
              this.personSupportedForm.get('contactDetails').get('emailAddress').disable();
              this.personSupportedForm.get('participantV2Details').get('firstName').setValue(data.firstName);
              this.personSupportedForm.get('participantV2Details').get('lastName').setValue(data.lastName);
              this.personSupportedForm.get('participantV2Details').get('dateOfBirth').setValue(data.dateOfBirth);
              this.personSupportedForm.get('participantV2Details').get('gender').setValue(data.gender);
              this.personSupportedForm.get('participantV2Details').get('otherGender').setValue(data.otherGender);
              this.personSupportedForm.get('participantV2Details').get('niNumber').setValue(data.niNumber);
              this.personSupportedForm.get('participantV2Details').get('workerId').setValue(data.workerId);
              this.personSupportedForm.get('participantV2Details').get('ethnicityId').setValue(data.ethnicityId);
              this.personSupportedForm.get('participantV2Details').get('boroughId').setValue(data.participantV2Details.borough);
              this.previousQualifications = data.previousQualifications
              this.dataSource.data = data.previousQualifications
              this.previousQualificationAsSelected = data.participantV2Details.previousQualificationId == 1 ? true : false
              this.towardsQualifications = data.towardsQualifications;
              this.toWardsQualificationAsSelected = data.participantV2Details.towardsQualificationId == 1 ? true : false
              this.toWardQualificationProgress = data.towardsQualifications.filter(data => data.achievedDate == null)
              this.toWardsQualificationDone = data.towardsQualifications.filter(data => data.achievedDate != null)
              this.dataSource1.data = this.toWardQualificationProgress
              this.dataSource2.data = this.toWardsQualificationDone
              if (data.participantV2Details.jobSectorInterestedData != null) {
                this.personSupportedForm.get('participantV2Details').get('choiceIds').setValue(data.participantV2Details.jobSectorInterestedData.choiceIds);
                this.personSupportedForm.get('participantV2Details').get('other').setValue(data.participantV2Details.jobSectorInterestedData.other);
              }
              if (data.disabilityHealth.disabilityOther !== null) {
                this.multipleValueOrOtherFeild = true;
              }
              if (data.disabilityHealth.healthConditionOther != null) {
                this.healthConditionOtherFeild = true;
              }
              if (data.disabilityHealth.mentalHealthOther !== null) {
                this.mentalHelthOrOtherFeildSelected = true;
              }
              this.getSupportedProgramData(data.participantV2Details.personTypes);

              this.getContractsData(data.participantV2Details.progmmeIds);
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

  checkLicences() {
    this.manageUsersService.getValidLicences(this.userType).subscribe(data => {
      if (data.isAuthorisedLicence) {
        this.router.navigateByUrl('/person-supported/new-participant');
      }
      else {
        this.router.navigateByUrl('/person-supported')
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
      padding: '22px'
    });
    dialogRef.subscribe(result => {
      if (result) { }
    });
  }

  createPersonSupportedForm() {
    this.personSupportedForm = this.fb.group({
      participantV2Details: this.getPersonSupportedDetails(),
      contactDetails: this.getContactDetailsForm(),
      emergencyContact: this.getEmergencyContactForm(),
      referralInfoV2: this.getReferralInformationDetails(),
      disabilityHealth: this.getDisabilitiesAndHealthConditionsDetails(),
    });
    this.filteredboroughsList = this.personSupportedForm.get('participantV2Details').get('boroughId').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  onOptionSelectd(option: any) {
    this.boroughId = option.id;
  }

  getFilterUserList() {
    this.manageUsersService.getFilterUserList(21).subscribe(data => {
      data.forEach((users: any) => {
        Object.assign(users, { userFullName: users.firstName + ' ' + users.lastName });
      });
      this.userList = data;
    })
  }

  getPersonSupportedDetails(): any {
    const personSupportedDetailsForm = this.fb.group({
      id: [null],
      firstName: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.namePattern)]],
      lastName: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.namePattern)]],
      dateOfBirth: [null, [Validators.required]],
      niNumber: [null, [Validators.required, Validators.pattern(this.niNumberPattern)]],
      gender: [null],
      joinedDate: [null, [Validators.required]],
      britishNational: [null],
      residentUKEEAlast3yrs: [null],
      workerId: [null, [Validators.required,]],
      keyMemberStaffPhoneNumber: [null, [Validators.maxLength(18), Validators.pattern(this.phoneNumberPattern)]],
      preferredPronounId: [null],
      otherPreferredPronoun: [null, [Validators.maxLength(100), Validators.minLength(3)]],
      programId: [null],
      additionalProgramsList: [null],
      boroughId: [null],
      theraGroupNumber: [null, [Validators.maxLength(50), Validators.pattern(/^TG\d{6}$/)]],
      ethnicityId: [null],
      otherEthnicity: [null, [Validators.maxLength(100), Validators.minLength(3)]],
      benefitsReceived: [null, Validators.maxLength(300)],
      previousQualificationId: [null],
      towardsQualificationId: [null],
      choiceIds: [null],
      other: [null, [Validators.maxLength(100)]],
      otherGender: [null, [Validators.maxLength(100), Validators.minLength(3)]],
      personTypes: [null, [Validators.required,]],
      progmmeIds: [null, [Validators.required,]],
      contracts: [null, [Validators.required,]],
    })
    return personSupportedDetailsForm;
  }

  getContactDetailsForm(): any {
    const contactDetailsForm = this.fb.group({
      id: [null],
      addressLine1: [null, [Validators.maxLength(100), Validators.minLength(3)]],
      addressLine2: [null, [Validators.maxLength(100), Validators.minLength(3)]],
      townOrCity: [null, [Validators.maxLength(100), Validators.pattern(this.onlyCharsPattern), Validators.minLength(3)]],
      county: [null, [Validators.maxLength(100), Validators.pattern(this.onlyCharsPattern), Validators.minLength(3)]],
      postCode: [null, [Validators.pattern(this.postCodePattern)]],
      emailAddress: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.emailPattern)]],
      contactNo: [null, Validators.pattern(this.phoneNumberPattern)],
      preferredContactMethod: [null],
    })
    return contactDetailsForm;
  }

  getEmergencyContactForm() {
    const emergencyContForm = this.fb.group({
      id: [null],
      firstName: [null, [Validators.maxLength(100), Validators.pattern(this.namePattern)]],
      contactNo: [null, [Validators.pattern(this.phoneNumberPattern)]],
      relationshipWithUser: [null, [Validators.pattern(this.onlyCharsPattern), Validators.maxLength(100), Validators.minLength(1)]],
      addressLine1: [null, [Validators.maxLength(100), Validators.minLength(3)]],
      addressLine2: [null, [Validators.maxLength(100), Validators.minLength(3)]],
      townOrCity: [null, [Validators.maxLength(100), Validators.pattern(this.onlyCharsPattern), Validators.minLength(3)]],
      country: [null, [Validators.maxLength(100), Validators.pattern(this.onlyCharsPattern), Validators.minLength(3)]],
      postcode: [null, [Validators.pattern(this.postCodePattern)]],
      mailAddress: [null, [Validators.maxLength(100), Validators.pattern(this.emailPattern)]],
    })
    return emergencyContForm;
  }

  getReferralInformationDetails() {
    const referralInformationForm = this.fb.group({
      madeReferral: [null, [Validators.required, Validators.maxLength(100)]],
      knowThemId: [null, [Validators.required]],
      other: [null, [Validators.maxLength(100)]],
      contactNumber: [null, [Validators.required, Validators.pattern(this.phoneNumberPattern)]],
      contactEmail: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.emailPattern)]],
      hearAboutService: [null, [Validators.required, Validators.maxLength(100)]],
      referralDate: [null, [Validators.required]]
    })
    return referralInformationForm;
  }

  getDisabilitiesAndHealthConditionsDetails() {
    const referralInformationDisabilitiesAndHealthConditionsForm = this.fb.group({
      disabilityId: [null],
      disabilityChoiceList: [null],
      disabilityOther: [null, [Validators.maxLength(100)]],
      healthConditionId: [null],
      healthConditionChoiceList: [null],
      healthConditionOther: [null, [Validators.maxLength(100)]],
      mentalHealthId: [null],
      mentalHealthChoiceList: [null],
      mentalHealthOther: [null, [Validators.maxLength(100)]],
    })
    return referralInformationDisabilitiesAndHealthConditionsForm;
  }

  onSelection1(event) {
    this.job1Value = event.value;
    if (this.job1Value != 0) {
      if (!(this.job1Value === (this.personSupportedForm.get('participantV2Details').get('programId').value))) {
        this.checkValue(this.job1Value);
      }
      else {
        this.checkValue(this.job1Value);
      }
    }
  }

  onSelection2(event) {
    const choice: any[] = event.value;
    const additionalProgramsListControl = this.personSupportedForm.get('participantV2Details').get('additionalProgramsList');
    const choiceid = choice.filter((num) => num === 6);
    
    if(choice!= null && choiceid.length ==1){
       this.personSupportedForm.get('participantV2Details').get('additionalProgramsList').reset();
       additionalProgramsListControl.setValue(choiceid);
    } 
  }

  onEthnicityOtherSelected(form, control) {
    if (this.personSupportedForm.get(form).get(control)?.value === 54) {
      return true;
    }
    else {
      this.personSupportedForm.get(form).get('otherEthnicity').reset();
      return false;
    }
  }

  onOtherPreferredPronounSelected(form, control) {
    if (this.personSupportedForm.get(form).get(control)?.value === 9) {
      return true;
    } else {
      this.personSupportedForm.get(form).get('otherPreferredPronoun').reset();
      return false;
    }
  }

  onOtherOtherSelected(form, control) {
    if (this.personSupportedForm.get(form).get(control)?.value === 13) {
      return true;
    }
    else {
      this.personSupportedForm.get(form).get('otherGender').reset();
      return false;
    }
  }

  checkValues(values) {
    if (values.includes(this.job1Value)) {
      this.jobCheck = true;
    }
  }

  checkValue(values) {
    if (this.job2Value.includes(values)) {
      this.jobCheck = true;
    }
    else {
      this.jobCheck = false;
    }
  }

  navigateHome() {
    this.router.navigate(['/person-supported']);
  }

  onSubmit() {
    this.isNew ? this.createLearner() : this.updateLearner();
  }

  createLearner() {
    if (this.personSupportedForm.valid) {
      const payload = this.createPayload();
      this.setNonMandatoryFieldsToNull(payload);
      if (payload.participantV2Details.choiceIds != null) {
        payload.participantV2Details.jobSectorInterestedData = {
          'choiceIds': payload.participantV2Details.choiceIds,
          'other': payload.participantV2Details.other,
        }
      }
      this.participantV2Service.saveNewLearners(payload).subscribe(() => {
        this.createOrUpdateLearner();
      },
        (error) => {
          this.snackBarService.error(error.error.applicationMessage);
        })
    }
  }

  updateLearner() {
    if (this.personSupportedForm.valid) {
      const payload = this.createPayload();
      payload.id = this.userId;
      this.setNonMandatoryFieldsToNull(payload);
      if (payload.participantV2Details.choiceIds != null) {
        payload.participantV2Details.jobSectorInterestedData = {
          'choiceIds': payload.participantV2Details.choiceIds,
          'other': payload.participantV2Details.other,
        }
      }
    
      this.participantV2Service.updateLearners(payload).subscribe(() => {
        this.createOrUpdateLearner();
        this.updatedStatus = false;
      },
        (error) => {
          this.snackBarService.error(error.error.applicationMessage);
        })
    }
  }

  createPayload() {
    const payload = this.personSupportedForm.getRawValue();
    payload.firstName = payload.participantV2Details.firstName;
    payload.lastName = payload.participantV2Details.lastName;
    payload.ethnicityId = payload.participantV2Details.ethnicityId
    payload.emailAddress = payload.contactDetails.emailAddress;
    payload.gender = payload.participantV2Details.gender;
    payload.otherGender = payload.participantV2Details.otherGender;
    payload.niNumber = payload.participantV2Details.niNumber.toUpperCase();
    payload.workerId = payload.participantV2Details.workerId;
    payload.participantV2Details.dateOfBirth = Utility.transformDateToString(payload.participantV2Details.dateOfBirth);
    payload.dateOfBirth = payload.participantV2Details.dateOfBirth;
    payload.participantV2Details.joinedDate = Utility.transformDateToString(payload.participantV2Details.joinedDate);
    payload.referralInfoV2.referralDate = Utility.transformDateToString(payload.referralInfoV2.referralDate)
    
    payload.previousQualifications = this.previousQualifications
    payload.towardsQualifications = this.towardsQualifications
    if (payload.contactDetails.postCode !== null) {
      payload.contactDetails.postCode = payload.contactDetails.postCode.toUpperCase();
    }
    if (payload.emergencyContact.postcode !== null) {
      payload.emergencyContact.postcode = payload.emergencyContact.postcode.toUpperCase();
    }
    if(this.personSupportedForm.get('participantV2Details').get('boroughId').value!=='')
    {
      payload.participantV2Details.boroughId = this.boroughId;
    }
    else {
      payload.participantV2Details.boroughId=null;
    }
    return payload;
  }

  setNonMandatoryFieldsToNull(payload) {
    if (payload.participantV2Details.gender === "") {
      payload.participantV2Details.gender = null;
    }
    if (payload.participantV2Details.niNumber === "") {
      payload.participantV2Details.niNumber = null;
    }
    if (payload.participantV2Details.britishNational === "") {
      payload.participantV2Details.britishNational = null;
    }
    if (payload.participantV2Details.residentUKEEAlast3yrs === "") {
      payload.participantV2Details.residentUKEEAlast3yrs = null;
    }
    if (payload.participantV2Details.workerId === "") {
      payload.participantV2Details.workerId = null;
    }
    if (payload.participantV2Details.keyMemberStaffPhoneNumber === "") {
      payload.participantV2Details.keyMemberStaffPhoneNumber = null;
    }
    if (payload.participantV2Details.programId === "") {
      payload.participantV2Details.programId = null;
    }
    if (payload.participantV2Details.additionalProgramsList === "") {
      payload.participantV2Details.additionalProgramsList = null;
    }
    if (payload.participantV2Details.preferredPronoun === "") {
      payload.participantV2Details.preferredPronoun = null;
    }
    if (payload.participantV2Details.theraGroupNumber === "") {
      payload.participantV2Details.theraGroupNumber = null;
    }
    if (payload.participantV2Details.boroughId === "") {
      payload.participantV2Details.boroughId = null;
    }
    if (payload.participantV2Details.ethnicityId === "") {
      payload.participantV2Details.ethnicityId = null;
    }

    if (payload.contactDetails.addressLine1 === "") {
      payload.contactDetails.addressLine1 = null;
    }
    if (payload.contactDetails.addressLine2 === "") {
      payload.contactDetails.addressLine2 = null;
    }
    if (payload.contactDetails.townOrCity === "") {
      payload.contactDetails.townOrCity = null;
    }
    if (payload.contactDetails.county === "") {
      payload.contactDetails.county = null;
    }
    if (payload.contactDetails.preferredContactMethod === "") {
      payload.contactDetails.preferredContactMethod = null;
    }
    if (payload.contactDetails.postCode === "") {
      payload.contactDetails.postCode = null;
    }
    if (payload.contactDetails.contactNo === "") {
      payload.contactDetails.contactNo = null;
    }

    if (payload.emergencyContact.firstName === "") {
      payload.emergencyContact.firstName = null;
    }
    if (payload.emergencyContact.contactNo === "") {
      payload.emergencyContact.contactNo = null;
    }
    if (payload.emergencyContact.relationshipWithUser === "") {
      payload.emergencyContact.relationshipWithUser = null;
    }
    if (payload.emergencyContact.mailAddress === "") {
      payload.emergencyContact.mailAddress = null;
    }
    if (payload.emergencyContact.addressLine1 === "") {
      payload.emergencyContact.addressLine1 = null;
    }
    if (payload.emergencyContact.addressLine2 === "") {
      payload.emergencyContact.addressLine2 = null;
    }
    if (payload.emergencyContact.townOrCity === "") {
      payload.emergencyContact.townOrCity = null;
    }
    if (payload.emergencyContact.country === "") {
      payload.emergencyContact.country = null;
    }
    if (payload.emergencyContact.postcode === "") {
      payload.emergencyContact.postcode = null;
    }
    if (payload.disabilityHealth.disabilityId === "") {
      payload.disabilityHealth.disabilityId = null;
    }
    if (payload.disabilityHealth.healthConditionId === "") {
      payload.disabilityHealth.healthConditionId = null;
    }
    if (payload.disabilityHealth.mentalHealthId === "") {
      payload.disabilityHealth.mentalHealthId = null;
    }
    if (payload.participantV2Details.choiceIds == "") {
      payload.participantV2Details.choiceIds = null;
    }
    if (payload.participantV2Details.towardsQualificationId === "") {
      payload.participantV2Details.towardsQualificationId = null;
    }
    if (payload.participantV2Details.previousQualificationId === "") {
      payload.disabilityHealth.previousQualificationId = null;
    }
  }

  createOrUpdateLearner() {
    const message = this.isNew ? 'Person Supported created successfully' : 'Person Supported updated successfully';
    this.snackBarService.success(message);
    this.router.navigate(['/person-supported']);
  }

  private _filter(value: string): boroughsNameList[] {
    if (!value) {
      return this.boroughsList;
    }
    const filterValue = value.toUpperCase;
    return this.boroughsList.filter((option: any) => option?.value.toUpperCase().includes(value) || option?.value.toLowerCase().includes(value));
  }

  getRefDataForHelthAndDesability() {
    this.statusYesNo = Utility.filterMapByKey("Status_Yes_No_PNS");
    this.disabilitiesList = Utility.filterMapByKey("Disabilities");
    this.healthCondtionList = Utility.filterMapByKey("Health_Condition");
    this.mentalHealthList = Utility.filterMapByKey("Mental_Health");
    this.knowThemList = Utility.filterMapByKey("Know_Them");
    this.statsForeducationAndLearning = Utility.filterMapByKey("Status_Yes_No");
    this.jobSectorInterested = Utility.filterMapByKey("Job_Sector_Interested");
    this.PreferredContactMethodList = Utility.filterMapByKey("Preferred_Contact_Method");
  }

  ondisabilitiesSelected(form, control) {

    if (this.personSupportedForm.get(form).get(control)?.value === 3) {

      return true;
    }
    else {

      this.personSupportedForm.get(form).get('disabilityChoiceList').reset();
      this.personSupportedForm.get(form).get('disabilityOther').reset();
      this.multipleValueOrOtherFeild = false;
      return false;
    }

  }
  onhealthConditionSelected(form, control) {
    if (this.personSupportedForm.get(form).get(control)?.value === 3) {
      return true;
    }
    else {
      this.personSupportedForm.get(form).get('healthConditionChoiceList').reset();
      this.personSupportedForm.get(form).get('healthConditionOther').reset();
      this.healthConditionOtherFeild = false;
      return false;
    }
  }

  onMettalHelthSelected(form, control) {
    if (this.personSupportedForm.get(form).get(control)?.value === 3) {
      return true;
    }
    else {
      this.personSupportedForm.get(form).get('mentalHealthChoiceList').reset();
      this.personSupportedForm.get(form).get('mentalHealthOther').reset();
      this.mentalHelthOrOtherFeildSelected = false;
      return false;
    }
  }

  onDisabilitiesMultipleOptionSelectd(form, control) {
    let listOfDisability = this.personSupportedForm.get(form).get(control)?.value;
    if (listOfDisability != null && listOfDisability.includes(34)) {
      return true;
    }
    else {
      this.personSupportedForm.get(form).get('disabilityOther').reset();
      return false;
    }
  }

  onMultipleOptionForhealthConditionSelectd(form, control) {
    let list = this.personSupportedForm.get(form).get(control)?.value;
    if (list != null && list.includes(45)) {
      return true;
    }
    else {
      this.personSupportedForm.get(form).get('healthConditionOther').reset();
      return false
    }
  }

  onMultipleOptionMentalHealthSelectd(form, control) {
    let list = this.personSupportedForm.get(form).get(control)?.value;
    if (list != null && list.includes(53)) {
      return true;
    }
    else {
      this.personSupportedForm.get(form).get('mentalHealthOther').reset();
      return false;
    }
  }
  ngOnDestroy(): void {
  }

  onReferalDetailsOtherSelected(form, control) {
    if (this.personSupportedForm.get(form).get(control)?.value === 21) {
      return true;
    }
    else {
      this.personSupportedForm.get(form).get('other').reset();
      return false;
    }
  }
  isSubmitDisabled() {
    return !this.personSupportedForm.valid;
  }

  onPreviousQualificationSelected(form, control) {
    if (this.personSupportedForm.get(form).get(control)?.value === 1) {
      this.previousQualificationAsSelected = true;
      return true;
    }
    else {
      this.previousQualificationAsSelected = false;
      return false;
    }
  }

  onAddPreviousQualification() {
    const dialogConfig = {
      panelClass: 'dialog-responsive',
      disableClose: true,
      autoFocus: false,
    };
    const dialogRef = this.dialog.open(AddPreviousQualificationPopComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(previousQualifications => {
      if (previousQualifications) {
        this.previousQualifications.push(previousQualifications)
        this.dataSource = this.previousQualifications.slice();
        this.cdRef.detectChanges();
      }
    });
  }

  onClickEditPreviousQualification(element, i) {
    let elementIndex = this.getIndex(element, i)
    const dialogRef = this.dialog.open(AddPreviousQualificationPopComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: 'dialog-responsive',
      data: element
    });
    dialogRef.afterClosed().subscribe(previousQualifications => {
      if (previousQualifications) {
        if (elementIndex !== -1) {
          this.previousQualifications[elementIndex] = previousQualifications;
        }
        this.dataSource = this.previousQualifications.slice();
        this.cdRef.detectChanges();
      }
    });
  }

  onDeletePreviousQualification(element, i) {
    let elementIndex = this.getIndex(element, i)
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete previous qualification`,
      message: `Are you sure you want to remove this qualification?`
    });
    dialogRef.subscribe(result => {
      if (result) {
        if (this.userId != undefined) {
          this.previousQualifications.splice(elementIndex, 1);
          this.cdRef.detectChanges();
          this.participantV2Service.onDeletePreviousQualification(element.id).subscribe(data => {
            this.dataSource = this.previousQualifications.slice();
            this.snackBarService.success('Previous qualification deleted successfully');
          })
        }
        else {
          this.previousQualifications.splice(elementIndex, 1);
          this.dataSource = this.previousQualifications.slice();
          this.snackBarService.success('Previous qualification deleted successfully');
        }
      }
    })
  }

  getIndex(element, i) {
    if (this.userId != undefined) {
      return this.previousQualifications.findIndex(data => data.id === element.id);
    }
    else {
      return i;
    }
  }

  onTowardsQualificationQualificationSelected(form, control) {
    if (this.personSupportedForm.get(form).get(control)?.value === 1) {
      this.toWardsQualificationAsSelected = true;
      return true;
    }
    else {
      this.toWardsQualificationAsSelected = false;
      return false;
    }
  }

  onAddTowardsQualification() {
    const dialogConfig = {
      panelClass: 'dialog-responsive',
      disableClose: true,
      autoFocus: false,
    };
    const dialogRef = this.dialog.open(ToWardsQualificanPopUpComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(toWardsQualifican => {
      if (toWardsQualifican) {
        if (toWardsQualifican.achievedDate == null) {
          this.toWardQualificationProgress.push(toWardsQualifican)
          this.dataSource1 = this.toWardQualificationProgress.slice();
          this.cdRef.detectChanges();
        }
        else {
          this.toWardsQualificationDone.push(toWardsQualifican)
          this.dataSource2 = this.toWardsQualificationDone.slice();
          this.cdRef.detectChanges();
        }
        this.towardsQualifications = [...this.toWardQualificationProgress, ...this.toWardsQualificationDone];
      }
    });
  }

  onClickEditTowardsQualification(element, i) {
    let index1
    let index
    let index2
    if (this.userId != undefined) {
      index2 = this.toWardsQualificationDone.findIndex(data => data.id === element.id);
    }
    else {
      index = i
    }
    const dialogRef = this.dialog.open(ToWardsQualificanPopUpComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: 'dialog-responsive',
      data: element
    });
    dialogRef.afterClosed().subscribe(toWardsQualifican => {
      if (toWardsQualifican) {
        if (this.userId !== undefined) {
          if (toWardsQualifican.achievedDate == null) {
            this.toWardsQualificationDone.splice(index2, 1);
            this.toWardQualificationProgress.push(toWardsQualifican);
            this.dataSource1 = this.toWardQualificationProgress.slice();
            this.dataSource2 = this.toWardsQualificationDone.slice();
            this.cdRef.detectChanges();
          }
          if (toWardsQualifican.achievedDate !== null) {

            this.toWardsQualificationDone[index2] = toWardsQualifican;
            this.dataSource1 = this.toWardQualificationProgress.slice();
            this.dataSource2 = this.toWardsQualificationDone.slice();
            this.cdRef.detectChanges();
          }
        }
        else {
          if (toWardsQualifican.achievedDate == null) {
            this.toWardQualificationProgress.push(toWardsQualifican);
            this.toWardsQualificationDone.splice(i, 1);
            this.dataSource1 = this.toWardQualificationProgress.slice();
            this.dataSource2 = this.toWardsQualificationDone.slice();
            this.cdRef.detectChanges();

          }
          if (toWardsQualifican.achievedDate !== null) {
            this.toWardsQualificationDone[i] = toWardsQualifican;
            this.dataSource1 = this.toWardQualificationProgress.slice();
            this.dataSource2 = this.toWardsQualificationDone.slice();
            this.cdRef.detectChanges();
          }
        }
      }
    });
  }

  onClickEditTowardsWorkingQualification(element, i) {
    let index
    let index1
    if (this.userId != undefined) {
      index1 = this.toWardQualificationProgress.findIndex(data => data.id === element.id);
    }
    else {
      index = i
    }
    const dialogRef = this.dialog.open(ToWardsQualificanPopUpComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: 'dialog-responsive',
      data: element
    });
    dialogRef.afterClosed().subscribe(toWardsQualifican => {
      if (toWardsQualifican) {
        if (this.userId !== undefined) {
          if (toWardsQualifican.achievedDate == null) {
            this.toWardQualificationProgress[index1] = toWardsQualifican;
            this.dataSource1 = this.toWardQualificationProgress.slice();
            this.cdRef.detectChanges();
          }
          if (toWardsQualifican.achievedDate !== null) {
            this.toWardQualificationProgress.splice(index1, 1);
            this.toWardsQualificationDone.push(toWardsQualifican);
            this.dataSource1 = this.toWardQualificationProgress.slice();
            this.dataSource2 = this.toWardsQualificationDone.slice();
            this.cdRef.detectChanges();
          }
        }
        else {
          if (toWardsQualifican.achievedDate == null) {
            this.toWardQualificationProgress[index] = toWardsQualifican;
            this.dataSource1 = this.toWardQualificationProgress.slice();
            this.cdRef.detectChanges();
          } else {
            this.toWardQualificationProgress.splice(index, 1);
            this.toWardsQualificationDone.push(toWardsQualifican)
            this.dataSource1 = this.toWardQualificationProgress.slice();
            this.dataSource2 = this.toWardsQualificationDone.slice();
            this.cdRef.detectChanges();
          }
        }
      }
    })
  }

  onDeleteToWordsQualification(element, i) {
    let index2
    if (this.userId != undefined) {
      index2 = this.toWardsQualificationDone.findIndex(data => data.id === element.id);
    }
    else {
      index2 = i
    }
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete working qualification`,
      message: `Are you sure you want to remove this qualification?`
    });
    dialogRef.subscribe(result => {
      if (result) {
        if (this.userId != undefined) {
          this.participantV2Service.onDeleteTowardsQualification(element.id).subscribe(data => {
            this.toWardsQualificationDone.splice(index2, 1)
            this.dataSource2 = this.toWardsQualificationDone.slice();
            this.cdRef.detectChanges();
            this.snackBarService.success('Working towards qualification deleted');
          })
        }
        else {
          this.toWardsQualificationDone.splice(index2, 1)
          this.dataSource2 = this.toWardsQualificationDone.slice();
          this.towardsQualifications = [...this.toWardQualificationProgress, ...this.toWardsQualificationDone];
          this.snackBarService.success('Working towards qualification deleted');
        }
      }
    })
  }

  onDeleteToWordsWorkingQualification(element, i) {
    let index1
    if (this.userId != undefined) {
      index1 = this.toWardQualificationProgress.findIndex(data => data.id === element.id);
    }
    else {
      index1 = i
    }
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete working qualification`,
      message: `Are you sure you want to remove this qualification?`
    });
    dialogRef.subscribe(result => {
      if (result) {
        if (this.userId != undefined) {
          this.participantV2Service.onDeleteTowardsQualification(element.id).subscribe(data => {
            this.toWardQualificationProgress.splice(index1, 1)
            this.dataSource1 = this.toWardQualificationProgress.slice();
            this.cdRef.detectChanges();
            this.snackBarService.success('Working towards qualification deleted');
          })
        }
        else {
            this.toWardQualificationProgress.splice(index1, 1)
            this.dataSource1 = this.toWardQualificationProgress.slice();
            this.towardsQualifications = [...this.toWardQualificationProgress, ...this.toWardsQualificationDone];
            this.snackBarService.success('Working towards qualification deleted');
            
        }
      }
    })
  }
  isPreviousQualificationAdded() {
    if (this.previousQualificationAsSelected == true) {
      let status = this.previousQualifications.length >= 1 ? true : false;

      if (status == true) {
        return !true;
      }
      else {
        return !false;
      }
    }
  }

  isToWardsQualificationAsSelected() {
    if (this.toWardsQualificationAsSelected == true) {
      let status = this.towardsQualifications.length >= 1 ? true : false;
      if (status == true) {
        return !true;
      }
      else {
        return !false;
      }
    }
  }

  onSelectionjobsector(event) {
    const choice: any[] = event.value;
    const choiceIdsControl = this.personSupportedForm.get('participantV2Details').get('choiceIds');
    if (choice != null && choice[0] == 622) {
      this.personSupportedForm.get('participantV2Details').get('choiceIds').reset();
      const choiceid = choice.filter((num) => num === 622);
      choiceIdsControl.setValue(choiceid);
    }
  }

  onSelectionjobsectorMultipleOptionSelectd(control) {
    let listOfDisability = this.personSupportedForm.get('participantV2Details').get(control)?.value;
    if (listOfDisability != null && listOfDisability.includes(672)) {
      return true;
    }
    else {
      this.personSupportedForm.get('participantV2Details').get('other').reset();
      return false;
    }
  }

  canExit(any) {
    const participantDetails = this.personSupportedForm.get('participantV2Details');
    if (participantDetails.dirty && this.participantV2Service.isLoggedIn && this.updatedStatus) {
      this.appConfirmService.confirm({
        message: 'Please save your form before leaving',
        title: 'Form not saved',
        showOkButtonOnly: true,
      })
      return this.confirm.navigateSelection;
    }
    else
      if (this.personSupportedForm.get('participantV2Details').get('previousQualificationId')?.value === 1 && this.previousQualifications.length === 0) {
        this.appConfirmService.confirm({
          message: 'Please save your previous qualification form before exiting',
          title: 'Progress not saved',
          showOkButtonOnly: true,
        })
        return this.confirm.navigateSelection;
      }
      else if (this.personSupportedForm.get('participantV2Details').get('towardsQualificationId')?.value === 1 && this.towardsQualifications.length === 0) {
        this.appConfirmService.confirm({
          message: 'Please save your towards qualification form before exiting',
          title: 'Progress not saved',
          showOkButtonOnly: true,
        })
        return this.confirm.navigateSelection;
      }
    return true;
  }

  getPersonTypeData() {
    this.participantV2Service.getPersonTypeData()
      .subscribe((data: any[]) => {
        this.personTypeData = data;
      data.forEach(item => {
      this.keyValueMapOfPersonType[item.id] = item;
       });
      });
  }

  onPersonTypeDataChange(event: any) {
    this.selectedPersonTypes = this.personSupportedForm.get('participantV2Details').get('personTypes').value;
    if(this.selectedPersonTypes.length==0)
    {
      this.getContractsData(this.selectedSupportedProgramData);
      this.getContractsData(this.selectedSupportedProgramData);
      this.getSupportedProgramData(this.selectedPersonTypes);
      this.personSupportedForm.get('participantV2Details').get('personTypes').reset
      this.personSupportedForm.get('participantV2Details').get('contracts').reset
      this.personSupportedForm.get('participantV2Details').get('progmmeIds').reset   
    }
    else
    {
      this.getSupportedProgramData(this.selectedPersonTypes);
      this.getContractsData(this.personSupportedForm.get('participantV2Details').get('progmmeIds').value);
      this.checkIsIdentifierIsPresent();
    }
    
  }

  getSupportedProgramData(event: any) {
    this.getContractsData(this.personSupportedForm.get('participantV2Details').get('progmmeIds').value);
   if(event!=null){
    this.participantV2Service.getSupportedProgramData(event)
      .subscribe((data: any[]) => {
        data.forEach(item => {
          this.keyValueMapOfProgrammeType[item.id] = item;
           });
      this.supportedProgramData = data;
      let programmeIds=  this.personSupportedForm.get('participantV2Details').get('progmmeIds').value;
      let supported = this.supportedProgramData.filter(item => programmeIds?.includes(item.id)).map(item => item.id);
      this.personSupportedForm.get('participantV2Details').get('progmmeIds').setValue(supported);
      this.getContractsData(supported);
      });
  }
  }

  onSupportedProgramChange(event: MatSelectChange) {
    this.selectedSupportedProgramData = event.value;
    this.getContractsData(this.selectedSupportedProgramData);
    this.checkIsIdentifierIsPresent();
    this.checkValidateContractType()
  }

  getContractsData(event: any) {
    if(event!=null){
    this.participantV2Service.getContractsData(event)
      .subscribe((data: any[]) => {
        this.socialEnterpriseData = data;
         data.forEach(item => {
          this.keyValueMapOfContractType[item.id] = item;
         }); 
      let contracts=  this.personSupportedForm.get('participantV2Details').get('contracts').value;
      let supported = this.socialEnterpriseData.filter(item => contracts.includes(item.id)).map(item => item.id);
      this.personSupportedForm.get('participantV2Details').get('contracts').setValue(supported);  
      });
    }
  }


checkIsIdentifierIsPresent() {
    let persontypes = this.personSupportedForm.get('participantV2Details').get('personTypes').value;
    let programmeType = this.personSupportedForm.get('participantV2Details').get('progmmeIds').value;
    let listofPersonTypeIdentifier = [];
    let listOfprogrammeTypeIdentifer = []
    if (persontypes.length>0) {
      persontypes.forEach(person => {
        let persontype = this.keyValueMapOfPersonType[person].identifier;
        listofPersonTypeIdentifier.push(persontype);
      })
    }
    if (programmeType.length>0) {
      programmeType.forEach(programmes => {
        let programme = this.keyValueMapOfProgrammeType[programmes].identifier
        listOfprogrammeTypeIdentifer.push(programme)
      })
      if (listofPersonTypeIdentifier.every(element => listOfprogrammeTypeIdentifer.includes(element))) {
        this.jobCheck = false;
      }
      else {
        this.jobCheck = true;
        let missingElements=  listofPersonTypeIdentifier.filter(element => !listOfprogrammeTypeIdentifer.includes(element))
        let personType = this.personTypeData.filter(person => missingElements.includes(person.identifier));
   
       let messasge =''
       personType.forEach(person=>{
       messasge= messasge +person.name+', ';
       })
       this.persontyese='';
        this.persontyese = messasge.slice(0, -2);
      }
  }
}
checkValidateContractType()
{
  let programmeType = this.personSupportedForm.get('participantV2Details').get('progmmeIds').value;
  let contracts = this.personSupportedForm.get('participantV2Details').get('contracts').value;
  let listOfConractsIdentifier = [];
  let listOfprogrammeTypeIdentifer = [];
  if(programmeType.length>0)
  {
    programmeType.forEach(programmes => {
      let programme = this.keyValueMapOfProgrammeType[programmes].programmeIdentifier
      listOfprogrammeTypeIdentifer.push(programme)
    })
  }
  if(contracts.length> 0)
  {
    contracts.forEach(contract => {
      let contractTypee = this.keyValueMapOfContractType[contract].identifier
      listOfConractsIdentifier.push(contractTypee)
    })
    if (listOfprogrammeTypeIdentifer.every(element => listOfConractsIdentifier.includes(element))) {
      this.contractsCheck = false;
    }
    else {
      this.contractsCheck = true;
      let missingElements=  listOfprogrammeTypeIdentifer.filter(element => !listOfConractsIdentifier.includes(element))
      let personType = this.supportedProgramData.filter(person => missingElements.includes(person.programmeIdentifier));
      let messasge =''
      personType.forEach(person=>{
      messasge= messasge +person.name+', ';
      })
      this.contracts='';
       this.contracts = messasge.slice(0, -2);
    }

  } 
}

onContractsSelected($event){
  this.checkValidateContractType();
}
}
