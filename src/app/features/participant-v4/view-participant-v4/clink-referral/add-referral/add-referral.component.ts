import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SrmService } from 'src/app/features/srm/srm.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { APP_DATE_FORMATS, AppDateAdapter } from 'src/app/framework/components/date-adapter/date-adapter';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { Utility } from 'src/app/framework/utils/utility';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';
import { ReferralService } from 'src/app/features/captr-learners/view-captr-learner/referral/referral.service';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { ParticipantV4Service } from '../../../participant-v4.service';
import { RegexPattern } from 'src/app/framework/constants/regex-constant';
import { id } from 'date-fns/locale';


@Component({
  selector: 'app-add-referral',
  templateUrl: './add-referral.component.html',
  styleUrls: ['./add-referral.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class AddReferralComponent implements OnInit,OnDestroy, AfterViewChecked {

  referralForm: FormGroup;
  name: any;
  userId: any;
  referralList: any;
  workerList: any = []
  organisationList: any;
  outcomeList: any;
  isNew: boolean;
  editData: any;
  otherRegex = /^[a-zA-Z][a-zA-Z0-9@' -]*$/
  disableFlag: boolean;
  profileUrl;
  allData;
  phoneNumberPattern = /^(\d{7}|\d{11})$/;
  emailPattern = RegexPattern.email;
  isReferral: boolean =false;


  constructor(
    private readonly fb: FormBuilder,
    private readonly inPageNavService: InPageNavService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly participantV4Service: ParticipantV4Service,
    private readonly srmService: SrmService,
    private readonly snackBarService: SnackBarService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly manageUsersService: ManageUsersService,
    private readonly learnerNavigation: LearnerNavigation,
  ) {  
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu1);
       
    this.participantV4Service.getRefDataAllDetails().subscribe(data => {
    this.allData = data;

})
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
  }

  ngOnInit(): void {
    this.inItReferralForm();
    this.getReferralList();
    this.setTitle();
    const userType = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userType;
    if(userType == 1){
      this.disableFlag = false;
    }else{
      this.disableFlag = true; 
    }

    const  userId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userId;
    //9 -captr
    this.manageUsersService.getFilterUserList(16).subscribe(userData=>{
      const result =  userData.filter(user => user.id == userId )
      if(result.length>0){  
        const value =[{"id":result[0].id , "userFullName":result[0].firstName + ' ' + result[0].lastName}]
        this.workerList = value;
        this.referralForm.get('referralDetails').get('workerId')?.setValue(result[0].id);
      }else {
        userData.forEach((users: any) => {
          Object.assign(users, { userFullName: users.firstName + ' ' + users.lastName });
        });
        this.workerList = userData;
      }
    })
    this.getOrganisationList();
    this.getRefOutcomeData();
  }

  setTitle() {   
    this.route.queryParams.subscribe((params: any) => {
      this.isNew = true
      if (params.referralId) {
        this.isNew = false
        this.onEditReffClicked(params.referralId)
      }
      this.name = params.name;
      this.userId = params.id;
      this.route.snapshot.data.title = `${this.name}`;
    });
  }

  inItReferralForm() {
    this.createReferralForm()     
  }

  createReferralForm(){
    this.referralForm = this.fb.group({
      referralDetails: this.getReferralDetailsForm(),
      fundingDetails: this.getFundingDetailsForm(),
    }); 
  }

  getReferralDetailsForm() {
    const referralDetailsForm = this.fb.group({
      id:[null],
      interventionId: [null,],
      userId: [null,],
      referralDate: [null,],
      workerId: [null,],
      notes: [null, [Validators.minLength(3)]],
      otherIntervention: [null , [Validators.minLength(3)]],
      organisationId: [null,],
      otherOrganisation: [null, [Validators.pattern(this.otherRegex),Validators.minLength(3)]],
      refOutcomeId: [],
      
    })
    return referralDetailsForm;
  }

  getFundingDetailsForm(){
    const additionalFields = this.fb.group({
      fundingType: [null],
      otherFundingType: [null,[Validators.maxLength(100), Validators.minLength(3)]],
      empReferralBy: [null], 
      otherEmpReferralBy :[null,[Validators.maxLength(100), Validators.minLength(3)]],
      fundingPurpose: [null],
      otherFundingPurpose: [null,[Validators.maxLength(100), Validators.minLength(3)]],
      fundingSource: [null],
      otherFundingSource: [null,[Validators.maxLength(100), Validators.minLength(3)]],
      educationFurtherDetails: [null,[Validators.maxLength(100), Validators.minLength(3)]],
      housingType: [null],
      otherHousingType: [null,[Validators.maxLength(100), Validators.minLength(3)]],
      mentalHealthRefTo: [null],
      otherMentalHealthRefTo:[null],
      mentalHealthDetails: [null,[Validators.maxLength(100), Validators.minLength(3)]],
      probationRegion: [null],
      probationOffice: [null,[Validators.maxLength(100), Validators.minLength(3)]],
      probationOfficer: [null,[Validators.maxLength(100), Validators.minLength(3)]],
      probationAdderss: [null,[Validators.maxLength(100), Validators.minLength(3)]],
      probationEmail: [null,[Validators.pattern(this.emailPattern)]],
      contactNo: [null,[Validators.pattern(this.phoneNumberPattern)]],
      misuseReferralBy: [null],
      otherMisuseRefBy:[null],
      misuseRefType: [null],
      otherMisuseRefType: [null,[Validators.maxLength(100), Validators.minLength(3)]],
      mpHealthReferralTo: [null],
      othermpHealthReferralTo: [null,[Validators.maxLength(100), Validators.minLength(3)]],
      mpHealthFurtherDetails: [null, [Validators.maxLength(100), Validators.minLength(3)]] ,   
    })
    return additionalFields;
  }
 

  getReferralList() {
    this.participantV4Service.getReferralDropdownList().subscribe(data => {
      this.referralList = data
    
    })
  }

  getOrganisationList() {
    this.participantV4Service.getOrganisationDropdownList().subscribe(data => {
      this.organisationList = data;
    })
  }

  getRefOutcomeData() {
    this.participantV4Service.getRefOutcomeData().subscribe(data => {
      this.outcomeList = data;
    })
  }

  onSubmit() {
    this.isNew ? this.addReferral() : this.updateReferral();
  }

  addReferral() {
    let date = this.referralForm.get('referralDetails').get('referralDate').value
    date = Utility.transformDateToString(date)
    this.referralForm.get('referralDetails').get('referralDate').setValue(date)    
    const payload = this.referralForm.value;
    payload.id = 0;
    payload.referralDetails.userId = this.userId;
    this.participantV4Service.addReferral(payload).subscribe(result => {
      this.snackBarService.success(result.message.applicationMessage);
      this.router.navigate([this.profileUrl + '/referral'], { queryParams: { id: this.userId, name: this.name } })
    },
      error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      });
  }

  updateReferral() {
    let date = this.referralForm.get('referralDetails').get('referralDate').value
    date = Utility.transformDateToString(date)
    this.referralForm.get('referralDetails').get('referralDate').setValue(date)
    const payload = this.referralForm.value;
    this.referralForm.get('referralDetails').get('id').setValue(id)
    payload.referralDetails.userId = this.userId;
    this.isReferral == true ? payload.otherIntervention:payload.otherIntervention = null;
    this.isOtherOrganisation(payload.organisationId)? payload.otherOrganisation : payload.otherOrganisation = null;
    this.participantV4Service.updateReferral(payload).subscribe(data => {
      this.snackBarService.success(data.message.applicationMessage);
      this.router.navigate([this.profileUrl + '/referral'], { queryParams: { id: this.userId, name: this.name } ,})
    },
      error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      });
  }

  onEditReffClicked(id) {  
    this.participantV4Service.editReferral(id).subscribe(data => {
      this.referralForm.patchValue(data);
      this.referralForm.get('referralDetails').get('id').setValue(data.referralDetails.id);
      this.referralForm.get('referralDetails').get('interventionId').setValue(data.referralDetails.interventionId);
      if(data.referralDetails.interventionId ==264){
        this.isReferral =true
      }else{
        this.isReferral = false
          }
      this.editData = data;  
     })
    
     
  }

  isOtherReferral(id) {
    let referral = this.referralList?.filter(data => data.id === id)[0];
    if (referral?.identifier.includes('OTR')) {
      return true;
    }
    return false;
  }

  isOtherOrganisation(id) {
    let organisation = this.organisationList?.filter(data => data.id === id)[0];
    if (organisation?.identifier.includes('OTH')) {
      return true;
    }
    else{
      return false;

    }
  }

  otherReset(id){
    const arrList = [966,927,937,933,951,940,944,947,919]
    if(arrList.includes(id)){
      return true;
    }else{
      return false;
    }
  }

  fundingTypeSelect() {
    const id = this.referralForm.get('fundingDetails').get('fundingType').value;
    switch (id) {
      case 919:
        return 1; // other
      case 918:
        return 2; // further education
      case 917:
        return 3; // employment
      case 916:
        return 4; // probation
      case 915:
        return 5; // mental health
      case 914:
        return 6; // medical/physical health
      case 913:
        return 7; // misuse
      case 912:
        return 8; // finance
      case 911:
        return 9; // housing
      default:
        return null;
    } 
  }

  resetValues(event){ 
   const eventId = event.value;
    if(eventId == 917){
      this.resetForm(event);
      this.addValidation('empReferralBy');
    }else if(eventId == 911){
      this.resetForm(event);
      this.addValidation('housingType');
    }else if(eventId == 916){
      this.resetForm(event);
      this.addValidationForProbation();
    }else if (eventId == 915){
      this.resetForm(event);
      this.addValidation('mentalHealthRefTo');
      this.referralForm.get('fundingDetails').get('mentalHealthDetails').setValidators([Validators.required , Validators.maxLength(100), Validators.minLength(3)]);
    }else if (eventId == 918){
      this.resetForm(event);
      this.referralForm.get('fundingDetails').get('educationFurtherDetails').setValidators([Validators.required , Validators.maxLength(100), Validators.minLength(3)]);
    }else if (eventId == 914){
      this.resetForm(event);
       this.addValidation('mpHealthReferralTo');
       this.referralForm.get('fundingDetails').get('mpHealthFurtherDetails').setValidators([Validators.required , Validators.maxLength(100), Validators.minLength(3)]);
    }else if (eventId == 912){
      this.resetForm(event);
       this.addValidation('fundingPurpose');
       this.addValidation('fundingSource');
    } else if (eventId == 913){
      this.resetForm(event);
       this.addValidation('misuseReferralBy');
       this.addValidation('misuseRefType');
    } else if(eventId === 919){
      this.resetForm(event);
      this.addValidation('otherFundingType');
      this.referralForm.get('fundingDetails').get('otherFundingType').setValidators([Validators.maxLength(100), Validators.minLength(3)]);
    }
  }

  resetForm(event){
    this.referralForm.get('fundingDetails').get('fundingType').setValue(event.value);
    const formGroup:any = this.referralForm.get('fundingDetails') 
    let key =Object.keys(formGroup.controls);

    key.forEach(controlName => {
      if(controlName ===  'fundingType'){
        this.referralForm.get('fundingDetails').get('fundingType').setValue(event.value);
      }else{
        const control = this.referralForm.get('fundingDetails').get(controlName)
        control.setValue(null);
        control.clearValidators();
        control.updateValueAndValidity();
      }
    });
  }

  addValidation(controlName){
      this.referralForm.get('fundingDetails').get(controlName).setValidators([Validators.required]);
      this.referralForm.get('fundingDetails').updateValueAndValidity();
  }

  addValidationForProbation(){
    this.referralForm.get('fundingDetails').get('probationRegion').setValidators([Validators.required]);
    this.referralForm.get('fundingDetails').get('probationOffice').setValidators([Validators.required , Validators.maxLength(100), Validators.minLength(3)]);
    this.referralForm.get('fundingDetails').get('probationOfficer').setValidators([Validators.required ,Validators.maxLength(100), Validators.minLength(3)]);
    this.referralForm.get('fundingDetails').get('probationAdderss').setValidators([Validators.required, Validators.maxLength(100), Validators.minLength(3)]);
    this.referralForm.get('fundingDetails').get('probationEmail').setValidators([Validators.required , Validators.pattern(this.emailPattern)]);
    this.referralForm.get('fundingDetails').get('contactNo').setValidators([Validators.required,Validators.pattern(this.phoneNumberPattern)]);
    this.referralForm.get('fundingDetails').updateValueAndValidity();
}

  addValidationForOther(value){
      if(value == 966){
        this.referralForm.get('fundingDetails').get('otherEmpReferralBy').setValidators([Validators.maxLength(100), Validators.minLength(3),Validators.required]);
        this.referralForm.get('fundingDetails').get('otherEmpReferralBy').updateValueAndValidity();
      }else{
        this.referralForm.get('fundingDetails').get('otherEmpReferralBy').clearValidators();
        this.referralForm.get('fundingDetails').get('otherEmpReferralBy').reset(); 
        this.referralForm.get('fundingDetails').get('empReferralby').setValidators([Validators.required]);  
        this.referralForm.get('fundingDetails').get('otherEmpReferralBy').updateValueAndValidity();
      }
  }

  addValidationForHousingOther(value){
    if(value == 927){
      this.referralForm.get('fundingDetails').get('otherHousingType').setValidators([Validators.maxLength(100), Validators.minLength(3),Validators.required]);
      this.referralForm.get('fundingDetails').get('otherHousingType').updateValueAndValidity();
    }else{
      this.referralForm.get('fundingDetails').get('otherHousingType').clearValidators();
      this.referralForm.get('fundingDetails').get('otherHousingType').reset(); 
      this.referralForm.get('fundingDetails').get('housingType').setValidators([Validators.required]);  
      this.referralForm.get('fundingDetails').updateValueAndValidity();
    }
  }

  addValidationForMentalHealth(value){
    if(value == 951){
      this.referralForm.get('fundingDetails').get('otherMentalHealthRefTo').setValidators([Validators.maxLength(100), Validators.minLength(3),Validators.required]);
      this.referralForm.get('fundingDetails').get('otherMentalHealthRefTo').updateValueAndValidity();
    }else{
      this.referralForm.get('fundingDetails').get('otherMentalHealthRefTo').clearValidators();
      this.referralForm.get('fundingDetails').get('otherMentalHealthRefTo').reset(); 
      this.referralForm.get('fundingDetails').get('mentalHealthRefTo').setValidators([Validators.required]);  
      this.referralForm.get('fundingDetails').updateValueAndValidity();
    }
  }

  addValidationForMedicalHealth(value){
    if(value == 947){
      this.referralForm.get('fundingDetails').get('othermpHealthReferralTo').setValidators([Validators.maxLength(100), Validators.minLength(3),Validators.required]);
      this.referralForm.get('fundingDetails').get('othermpHealthReferralTo').updateValueAndValidity();
    }else{
      this.referralForm.get('fundingDetails').get('othermpHealthReferralTo').clearValidators();
      this.referralForm.get('fundingDetails').get('othermpHealthReferralTo').reset(); 
      this.referralForm.get('fundingDetails').get('mpHealthReferralTo').setValidators([Validators.required]);  
      this.referralForm.get('fundingDetails').updateValueAndValidity();
    }
  }

  addValidationForFundingPurpose(value){ 
    if(value == 933){
      this.referralForm.get('fundingDetails').get('otherFundingPurpose').setValidators([Validators.maxLength(100), Validators.minLength(3),Validators.required]);
      this.referralForm.get('fundingDetails').get('otherFundingPurpose').updateValueAndValidity();
    }else{
      this.referralForm.get('fundingDetails').get('otherFundingPurpose').clearValidators();
      this.referralForm.get('fundingDetails').get('otherFundingPurpose').reset(); 
      this.referralForm.get('fundingDetails').get('fundingPurpose').setValidators([Validators.required]);  
      this.referralForm.get('fundingDetails').updateValueAndValidity();
    }
    
  }

  addValidationForFundingSource(value){ 
    if(value == 937){
      this.referralForm.get('fundingDetails').get('otherFundingSource').setValidators([Validators.maxLength(100), Validators.minLength(3),Validators.required]);
      this.referralForm.get('fundingDetails').get('otherFundingSource').updateValueAndValidity();
    }else{
      this.referralForm.get('fundingDetails').get('otherFundingSource').clearValidators();
      this.referralForm.get('fundingDetails').get('otherFundingSource').reset(); 
      this.referralForm.get('fundingDetails').get('fundingSource').setValidators([Validators.required]);  
      this.referralForm.get('fundingDetails').updateValueAndValidity();
    }
    
  }

  addValidationForSMARef(value){
  if(value == 940){
    this.referralForm.get('fundingDetails').get('otherMisuseRefBy').setValidators([Validators.maxLength(100), Validators.minLength(3),Validators.required]);
    this.referralForm.get('fundingDetails').get('otherMisuseRefBy').updateValueAndValidity();
  }else{
    this.referralForm.get('fundingDetails').get('otherMisuseRefBy').clearValidators();
    this.referralForm.get('fundingDetails').get('otherMisuseRefBy').reset(); 
    this.referralForm.get('fundingDetails').get('misuseReferralBy').setValidators([Validators.required]);  
    this.referralForm.get('fundingDetails').updateValueAndValidity();
  }
   }

   addValidationForSMAType(value){
    if(value == 944){
      this.referralForm.get('fundingDetails').get('otherMisuseRefType').setValidators([Validators.maxLength(100), Validators.minLength(3),Validators.required]);
      this.referralForm.get('fundingDetails').get('otherMisuseRefType').updateValueAndValidity();
    }else{
      this.referralForm.get('fundingDetails').get('otherMisuseRefType').clearValidators();
      this.referralForm.get('fundingDetails').get('otherMisuseRefType').reset(); 
      this.referralForm.get('fundingDetails').get('misuseRefType').setValidators([Validators.required]);  
      this.referralForm.get('fundingDetails').updateValueAndValidity();
    }
     }


  
}

