import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegexPattern } from 'src/app/framework/constants/regex-constant';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { ManageUsersService } from '../../manage-users/manage-users.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ParticipantV6Service } from '../participant-v6.service';
import { DateAdapter } from 'angular-calendar';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';

@Component({
  selector: 'app-add-edit-participant-v6',
  templateUrl: './add-edit-participant-v6.component.html',
  styleUrls: ['./add-edit-participant-v6.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
  
})


export class AddEditParticipantV6Component implements OnInit {

  learnersForm: FormGroup;
  currentDate = new Date();
  maxDateOfBirth = new Date(new Date().setDate(this.currentDate.getDate()-1));
  minDateOfBirth = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
  namePattern = RegexPattern.namePattern;
  emailPattern = RegexPattern.email;
  phoneNumberPattern = /^(\d{11})$/;

  refAnswer: any;
  titles = ['Ms', 'Mx', 'Mrs', 'Miss', 'Mr', 'Dr', 'Prof', 'Lady', 'Sir', 'Rev', 'Lord', 'Maj',
    'Capt', 'Pte', 'Sgt', 'Ssgt', 'Lt', 'Col', 'Brig', 'Cpl', 'Lcpl', '2Lt', 'WO1', 'WO2', 'Master', 'Other', 'N/A'];

  isNew = false;
  genderList: any;
  deactivated: boolean;
  onlyCharsPattern = /^([a-zA-Z]+\s)*[a-zA-Z+\s]+$/;
  firstNamePattern = `([a-zA-Z]{1,})`;
  lastNamePattern = `([a-zA-Z]{1,}(\\s?|'?|-?)[a-zA-Z]{1,})`;
  membershipNoRegex = /^[A-Z]{2}\d{7}$/;
  postCodePattern =
    /^(([A-Z][0-9]{1,2})|(([A-Z][A-HJ-Y][0-9]{1,2})|(([A-Z][0-9][A-Z])|([A-Z][A-HJ-Y][0-9]?[A-Z])))) [0-9][A-Z]{2}$/;
  refData;
  userList:any[]=[];
  userType: number = 3;
  allocatedRefData;

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly participantV6Service: ParticipantV6Service,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly appConfirmService: AppConfirmService,
    private readonly manageUsersService: ManageUsersService
    ) {
    this.participantV6Service.getRefAnswer().subscribe(data => {
      this.refAnswer = data;
      this.refAnswer = this.refAnswer.filter(ref => ref.identifier !== 'PNS')

    })
    this.participantV6Service.getUserRefDataDetails().subscribe(data => {
      this.refData = data;
    })

    this.participantV6Service.getAllocatedRefData().subscribe(data =>{
      this.allocatedRefData = data;
    })
    this.getFilterUserList();
   
  }  

  ngOnInit(): void {
    this.initLearnersForm();
  }

  ngOnDestroy() {
    this.stepperNavigationService.stepper(null);
  }

  navigateHome() {
    this.router.navigate(['/rws-participant']);
  }

  initLearnersForm() {
    this.createLearnersForm();
    this.route.queryParams.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.isNew = false;
        this.participantV6Service.getUserDetails(+params['id'])
          .subscribe(
            (data: any) => {
              this.learnersForm.patchValue(data);
              this.learnersForm.get('primaryLearnerDetails').get('emailAddress').disable();

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
      emergencyContact: 
      this.fb.array([
        this.fb.group({
          id: [null],
          firstName: [null, [Validators.maxLength(100), Validators.pattern(this.namePattern)]],
          contactNo: [null, [Validators.pattern(this.phoneNumberPattern)]],
          relationshipWithUser: [null, [Validators.pattern(this.onlyCharsPattern), Validators.maxLength(100), Validators.minLength(1)]],
          isPrimary : [true],
                }),
        this.fb.group({
          id: [null],
          firstName: [null, [Validators.maxLength(100), Validators.pattern(this.namePattern)]],
          contactNo: [null, [Validators.pattern(this.phoneNumberPattern)]],
          relationshipWithUser: [null, [Validators.pattern(this.onlyCharsPattern), Validators.maxLength(100), Validators.minLength(1)]],
          isPrimary : [false],
            })
       ]),
     });
  }

  getPrimaryLearnerDetails() {
    const primaryLearnerDetailsForm = this.fb.group({
      id: [null],
      firstName: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.namePattern)]],
      lastName: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.namePattern)]],
      emailAddress: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.emailPattern)]],
      phoneNo: [null, [Validators.pattern(this.phoneNumberPattern),Validators.required]],
      allocatedProgramme:[null,Validators.required],
      memberShipNumber:[null, [Validators.pattern(this.membershipNoRegex),Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      gender: [null,[Validators.required]],
      allocatedPhoneNo: [null, [Validators.pattern(this.phoneNumberPattern),Validators.required]],
      workerId:[null, [Validators.required]],
      workerTelephoneNo:[null, [Validators.pattern(this.phoneNumberPattern)]]
       })
    return primaryLearnerDetailsForm;
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
    this.participantV6Service.saveNewLearners(payload).subscribe((resp) => {
      this.createOrUpdateLearner(resp);
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  updateLearner() {
    const payload = this.learnersForm.getRawValue();     
    payload.primaryLearnerDetails.dateOfBirth = Utility.transformDateToString(payload.primaryLearnerDetails.dateOfBirth);
    this.setNonMandatoryFieldsToNull(payload);
    this.participantV6Service.updateLearners(payload).subscribe((resp) => {
      
      this.createOrUpdateLearner(resp);
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  setNonMandatoryFieldsToNull(payload){
    

   
    if (payload.emergencyContact[0].firstName === "" || payload.emergencyContact[0].firstName === undefined) {
      payload.emergencyContact[0].firstName = null;
    }
    if (payload.emergencyContact[0].contactNo === "" || payload.emergencyContact[0].contactNo === undefined) {
      payload.emergencyContact[0].contactNo = null;
    }
    if (payload.emergencyContact[0].relationshipWithUser === "" || payload.emergencyContact[0].relationshipWithUser === undefined) {
      payload.emergencyContact[0].relationshipWithUser = null;
    }
    if (payload.emergencyContact[1].firstName === "" || payload.emergencyContact[1].firstName === undefined) {
      payload.emergencyContact[1].firstName = null;
    }
    if (payload.emergencyContact[1].contactNo === "" || payload.emergencyContact[1].contactNo === undefined) {
      payload.emergencyContact[1].contactNo = null;
    }
    if (payload.emergencyContact[1].relationshipWithUser === "" || payload.emergencyContact[1].relationshipWithUser === undefined) {
      payload.emergencyContact[1].relationshipWithUser = null;
    }


  console.log(payload);
  
      
}


  createOrUpdateLearner(resp:any) {
    const message = this.isNew ? 'Participant created successfully' : 'Participant updated successfully';
    this.snackBarService.success(message);
    this.router.navigate(['/rws-participant']);
  }


  getFormByName(formName) {
    return this.learnersForm.get(formName) as FormGroup
  }

  getFilterUserList() {
    this.manageUsersService.getFilterUserList(25).subscribe(data=>{
      data.forEach((users: any) => {
        Object.assign(users, { userFullName: users.firstName + ' ' + users.lastName });
      });
      this.userList = data;
    })
  }

  checkLicences() {

    this.manageUsersService.getValidLicences(this.userType).subscribe(data => {
      if (data.isAuthorisedLicence) {
        this.router.navigateByUrl('/rws-participant/new-participant');
      }
      else {
        this.router.navigateByUrl('/rws-participant')
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


}
