import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';

import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { ManageUsersService } from '../../manage-users/manage-users.service';
import { RegexPattern } from 'src/app/framework/constants/regex-constant';
import { EditParticipantV4Steps } from './edit-participant-v4.steps';
import { ParticipantV4Service } from '../participant-v4.service';
import { QualificationPopUpComponent } from './qualification-pop-up/qualification-pop-up.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-participant-v4',
  templateUrl: './add-edit-participant-v4.component.html',
  styleUrls: ['./add-edit-participant-v4.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})export class AddEditParticipantV4Component implements OnInit , OnDestroy{

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
  otherRegex = /^[a-zA-Z]([a-zA-Z0-9@' -]*[a-zA-Z0-9@' -])*?$/
  refData;
  allData;
  userList:any[]=[];
  userType: number = 3;
  isQualificationSelected: boolean;
  displayedColumns: string[] = ['qualification', 'siteOfQualificationCompletion', 'fullyPartlyCompleted', 'qualificationDateAchived', 'actions'];
  qualificationsList: any[] = [];
  userId;
  dataSource: any = new MatTableDataSource<any>();
  cityAndGuildsPattern=/^[a-zA-Z]{3}[0-9]{4}$/;
  nomisRegex = /^[A]\d{4}[A-Z]{2}$/;
  isNewPopUp:boolean=true;


  constructor(private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly editParticipantV4Steps: EditParticipantV4Steps,
    private readonly participantV4Service: ParticipantV4Service,
    private readonly appConfirmService: AppConfirmService,
    private readonly manageUsersService: ManageUsersService,
    private readonly dialog: MatDialog,
    private readonly cdRef: ChangeDetectorRef,

 
    ) {
    this.stepperNavigationService.stepper(this.editParticipantV4Steps.stepsConfig);
    this.participantV4Service.getRefAnswer().subscribe(data => {
      this.refAnswer = data;
      this.refAnswer = this.refAnswer.filter(ref => ref.identifier !== 'PNS')

    })
    this.participantV4Service.getUserRefDataDetails().subscribe(data => {
      this.refData = data;
    })
    this.participantV4Service.getRefDataAllDetails().subscribe(data => {
      this.allData = data;
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
      this.learnersForm.get(form).get('otherHouseholdSituation').reset();

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

  otherHouseSituationReset() {
    if (this.learnersForm.get('equalityAndDiversity').get('householdSituation').value === 17) {
      return true;
    }
    else {
      this.learnersForm.get('equalityAndDiversity').get('otherHouseholdSituation').reset();
      return false;
    }
  }

  otherGenderReset(){
    if ((this.learnersForm.get('primaryLearnerDetails').get('gender').value === 13)) {
      return true;
    }
    else {
      this.learnersForm.get('primaryLearnerDetails').get('otherGender').reset();
      return false;
    }
  }

  ngOnInit(): void {
    this.stepperNavigationService.stepper(this.editParticipantV4Steps.stepsConfig);
    this.route.queryParams.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.userId = +params['id'];       
      }
    })
    this.initLearnersForm();
    
  }

  ngOnDestroy() {
    this.stepperNavigationService.stepper(null);
  }

  navigateHome() {
    this.router.navigate(['/clink-learners']);
  }

  initLearnersForm() {
    this.createLearnersForm();
    this.route.queryParams.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.userId = +params['id'];
        this.isNew = false;
        this.participantV4Service.getUserDetails(+params['id'])
          .subscribe(
            (data: any) => {
              this.learnersForm.patchValue(data);
              this.learnersForm.get('primaryLearnerDetails').get('uniqueId').setValue(this.userId);
              this.learnersForm.get('contactDetails').get('emailAddress').disable();
              this.learnersForm.get('primaryLearnerDetails').get('uniqueId').disable();
              this.qualificationsList=data.qualification
              this.dataSource.data=data.qualification 
              if(this.dataSource !== null){
                this.isQualificationSelected = true;
              }

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
      qualificationDetails: this.getQualificationDetailsForm(),
    });
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
      isBritishNational: [null],
      isResidentOfUKorEEA: [null],
      workerId: [null],
      workerTelephoneNo:[null,  [Validators.maxLength(18),Validators.pattern(this.phoneNumberPattern)]],
      uniqueId: [null],
      nomisNo: [null, [Validators.pattern(this.nomisRegex)]]
    })
    return primaryLearnerDetailsForm;
  } 

  getEqualityAndDiversityForm() {
    const equalityAndDiversityForm = this.fb.group({
      id: [null],
      isEqualityAndDiversityInformationId: [null],
      caringResposibilities: [null],
      householdSituation: [null],
      otherHouseholdSituation: [null, [Validators.maxLength(100), Validators.minLength(3)]],
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
      isAddressApproved: [null],
      isNFA: [null]
    })
    return contactDetailsForm;

  }

  getQualificationDetailsForm() {
    const learnerQualificationForm = this.fb.group({
      id: [null],
      participantId: [null],
      projectGraduate: [null],
      cityAndGuildsEnrolmentNumber:[null,[Validators.pattern(this.cityAndGuildsPattern)]],
      nvqsQualification: [null],
    })
    return learnerQualificationForm;
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
    payload.qualification=this.qualificationsList;
    this.setNonMandatoryFieldsToNull(payload);
    this.participantV4Service.saveNewLearners(payload).subscribe(resp => {
    this.createOrUpdateLearner(resp);
    // this.snackBarService.success(resp.message.applicationMessage);

    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  updateLearner() {
    const payload = this.learnersForm.getRawValue();
    payload.primaryLearnerDetails.dateOfBirth = Utility.transformDateToString(payload.primaryLearnerDetails.dateOfBirth);
    this.setNonMandatoryFieldsToNull(payload);
    payload.qualification=this.qualificationsList;
    this.participantV4Service.updateLearners(payload).subscribe(resp => {
      this.createOrUpdateLearner(resp);
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
    if (payload.qualificationDetails.projectGraduate === "") {
      payload.qualificationDetails.projectGraduate=null;
    }
    if (payload.qualificationDetails.cityAndGuildsEnrolmentNumber === "") {
      payload.qualificationDetails.cityAndGuildsEnrolmentNumber=null;
    }if (payload.qualificationDetails.nvqsQualification === "") {
      payload.qualificationDetails.nvqsQualification=null;
    }
    if (payload.primaryLearnerDetails.nomisNo === "") {
      payload.primaryLearnerDetails.nomisNo=null;
    }
   

  }

  createOrUpdateLearner(resp:any) {
    this.snackBarService.success(resp.message.applicationMessage);
    this.router.navigate(['/clink-learners']);
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
    this.manageUsersService.getFilterUserList(17).subscribe(data=>{
      data.forEach((users: any) => {
        Object.assign(users, { userFullName: users.firstName + ' ' + users.lastName });
      });
      this.userList = data;
    })
  }

  checkLicences() {

    this.manageUsersService.getValidLicences(this.userType).subscribe(data => {
      if (data.isAuthorisedLicence) {
        this.router.navigateByUrl('/clink-learners/new-learner');
      }
      else {
        this.router.navigateByUrl('/clink-learners')
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

  onNvqsAchievedSelected(form, control) {
    if (this.learnersForm.get(form).get(control)?.value === 1) {
      this.isQualificationSelected = true;
      return this.isQualificationSelected;
    }
    else {
      this.isQualificationSelected = false;
      return this.isQualificationSelected;
    }
  }

  onAddNVQSQualification() {
    const dialogConfig = {
      panelClass: 'dialog-responsive',
      disableClose: true,
      autoFocus: false,
      data : this.qualificationsList
    };
    const dialogRef = this.dialog.open(QualificationPopUpComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(qualificationsDetails => {
      if (qualificationsDetails) {
        if (this.qualificationsList == null) {
          this.qualificationsList = [];
        }else{
          this.qualificationsList.push(qualificationsDetails)
        this.dataSource = this.qualificationsList.slice();
        this.dataSource  =  this.dataSource .filter(item => item.nvqsQualification !== null);
        this.cdRef.detectChanges();
      }
    }
    });
  }

  onClickEditQualification(element,i) {
    const ListWithElement  = { 
      popupObj : element,
      listdata : this.qualificationsList
    }
    let elementIndex =   this.getIndex(element,i)
    const dialogRef = this.dialog.open(QualificationPopUpComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: 'dialog-responsive',
      data: ListWithElement
    });
    dialogRef.afterClosed().subscribe(qualifications => {
      if (qualifications) {
        if (elementIndex !== -1) {
          this.qualificationsList[i] = qualifications;
        }

        this.dataSource = this.qualificationsList.slice();
        this.dataSource  =  this.dataSource .filter(item => item.nvqsQualification !== null);
        this.cdRef.detectChanges();
      }
    });
  }

  onDeleteQualification(element,i) {
    let elementIndex=   this.getIndex(element,i)
     const dialogRef = this.appConfirmService.confirm({
       title: `Delete NVQS qualification`,
       message: `Are you sure you want to remove this qualification?`
     });
     dialogRef.subscribe(result => {
       if (result) {
         if (this.userId != undefined && element.id != undefined) {
           this.qualificationsList.splice(elementIndex, 1);
           this.cdRef.detectChanges();
           this.participantV4Service.onDeleteQualification(element.id).subscribe(data => {
             this.dataSource = this.qualificationsList.slice();
             this.dataSource  =  this.dataSource .filter(item => item.nvqsQualification !== null);
             this.snackBarService.success('NVQS qualification deleted successfully');
           })
         }
         else {
           this.qualificationsList.splice(elementIndex, 1);
           this.dataSource = this.qualificationsList.slice();
           this.snackBarService.success('NVQS qualification deleted successfully');
         }
       }
     })
   }

   getIndex(element, i) {
    if (this.userId != undefined) {
      return this.qualificationsList.findIndex(data => data.id === element.id);
    }
    else {
      return i;
    }
  }

  isQualificationAdded(){
    if(this.isQualificationSelected == true){
      let status = this.qualificationsList?.length >=1 ? true : false;
      if(status == true){
        return !true;
      }else{
        return !false
      }
    }
  }


}
