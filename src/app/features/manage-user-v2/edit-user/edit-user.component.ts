import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { ManageUserV2Service } from '../manage-user-v2.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { IUser } from '../user.interface';
import { RegexPattern } from 'src/app/framework/constants/regex-constant';
import { IEstablishment, ILotname } from '../../shared/components/org-search-filter/org-search-filter.interface';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  routeIntent: string;
  header= "Allocate(s)*";
  userForm: FormGroup;
  public rolesObjCtrl: FormControl = new FormControl();
  formData: IUser;
  telephoneCodePattern = /^[0-9]*$/;
  isNew = false;
  hasAccessToAllOrganizations = true;
  authenticatedUserRoleId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).roleId;
  namePattern = RegexPattern.namePattern
  emailPattern = RegexPattern.email;
  usernamePattern = /^[a-zA-Z_0-9]*(\.[a-zA-Z_0-9]+)?$/;
  titles = [
    'Mr', 'Mrs', 'Miss', 'Ms', 'Mx', 'Sir', 'Dr', 'Prof', 'Lady', 'Rev', 'Lord', 'Maj',
    'Capt', 'Pte', 'Sgt', 'Ssgt', 'Lt', 'Col', 'Brig', 'Cpl', 'Lcpl', '2Lt', 'WO1', 'WO2', 'Master', 'Other', 'N/A'
  ];
  roles = [];
  newUserTypeId: number;
  manageUserUrl = 'v2/manage-users';
  userType = 2
  refregion;
  allData;
  organizations: any;
  lotNames: ILotname[] = [];
  userOrganizations: IEstablishment[] = [];
  isEstablishmentSelectable: boolean = true;
  isMultilpeAllowed: boolean = true;
  filteredOrganizations;
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly appConfirmService: AppConfirmService,
    private readonly manageUserV2service: ManageUserV2Service,
    private readonly snackBar: SnackBarService
  ) {
    console.log('asdfgdsadfghfthgdf')
    this.manageUserV2service.getRegionData().subscribe(data => {
      this.refregion = data;
      console.log(this.refregion)
    })
    this.manageUserV2service.getRefDataAllDetails().subscribe(data => {
      this.allData = data;
      console.log(this.allData)
    });
   }

  ngOnInit() {
    console.log("gh")
    this.resolveOrganizations();
    this.resolveRouteIntent();
    this.resolveRoles();
    this.initDataForm();
  }

  resolveRouteIntent() {
    if (this.activatedRoute.snapshot.data['title'] === 'Edit User') {
      this.routeIntent = 'editUser';
    } else {
      this.routeIntent = 'newUser';
      this.checkLicences();
      this.manageUserV2service.getUserTypes().subscribe(userTypes => {
        this.newUserTypeId = userTypes[0].id;
      })
    }
  }

  resolveOrganizations() {   
    this.manageUserV2service.getOrganizations().subscribe(data => {
      
      this.organizations = data.organizations.map((item: any) => ({
        id: item.id,
        isPrimary: false,
        organizationName: item.organizationName,
        lotName: item.lotName
      }));
        this.lotNames = data.lotNames;
      if (this.isNew && (this.authenticatedUserRoleId === 3 || this.authenticatedUserRoleId === 4)) {
        this.userForm.controls.orgList.disable();
      }
   });   
  }

  resolveRoles() {
    this.manageUserV2service.getUserRoles().subscribe(roles => {
      this.roles = roles;
    })
  }

  initDataForm() {
    this.createUserForm();
    this.updateOrganizations(this.formData.orgList);
    this.userOrganizations = this.formData.orgList ? this.formData.orgList:[];
  }

  createUserForm() {
    this.userForm = this.fb.group({
      id: '',
      accountType: [null, [Validators.required, Validators.maxLength(35)]],
      accountState: [null],
      title: [null],
      firstName: ['', [Validators.required, Validators.maxLength(100),Validators.pattern(this.namePattern)]],
      lastName: ['', [Validators.required, Validators.maxLength(100),Validators.pattern(this.namePattern)]],
      userName: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(this.usernamePattern)]],
      emailAddress: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(this.emailPattern)]],
      phoneNumber: [null, [Validators.maxLength(18), Validators.pattern(this.telephoneCodePattern)]],
      userTypeId: null,
      region:[null,[Validators.required]],
      prison:[null,[Validators.required]],
      orgList: this.fb.array([], [Validators.required])
    });

    if (this.routeIntent === 'editUser') {
      this.activatedRoute.params.subscribe((params: any) => {
        this.manageUserV2service.getUserDetails(params.id).subscribe(userData => {
          this.formData = userData;
          console.log(this.formData)
          this.userForm.setValue({
            id: userData.id,
            accountType: userData.accountType,
            accountState: userData.accountState,
            title: userData.title,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userName: userData.userName,
            emailAddress: userData.emailAddress,
            phoneNumber: userData.phoneNumber,
            userTypeId: userData.userTypeId,
            region:userData.region,
            prison:userData.prison,
            orgList:''
          })
          this.userForm.controls['orgList'].setValue(userData.orgList);
        })
      })
    }
  }

  onSubmit(userForm) {
    if (this.routeIntent === 'newUser') {
      this.onSaveNewUser(userForm);
    } else if (this.routeIntent === 'editUser') {
      this.onUpdateUser(userForm);
    }
  }

  onUpdateUser(userForm) {
    const payload = this.formatPayload(userForm);
    this.manageUserV2service.updateUser(payload).subscribe(resp => {
      this.snackBar.success(JSON.parse(resp).applicationMessage);
      this.router.navigate([this.manageUserUrl]);
    }, error => {
      this.snackBar.error(error.error.applicationMessage);
    })
  }

  onSaveNewUser(userForm) {
    const payload = this.formatPayload(userForm);
    payload.userTypeId = 2
    this.manageUserV2service.createUser(payload).subscribe(resp => {
      this.snackBar.success(resp.message.applicationMessage);
      this.router.navigate([this.manageUserUrl]);
    }, error => {
      this.snackBar.error(error.error.applicationMessage);
    })
  }

  showFormSuccessMessageThenRouteUser(resp) {
    this.snackBar.success(resp.message.applicationMessage);
    this.router.navigate([this.manageUserUrl]);
  }

  formatPayload(userForm) {
    const userFormRaw = userForm.getRawValue();
    return {
      ...userFormRaw,
      accountType: this.routeIntent === 'editUser' ? userForm.controls.accountType.value : userFormRaw.accountType.roleId,
      userTypeId: this.routeIntent === 'newUser' ? this.newUserTypeId : userForm.controls.userTypeId.value,
      firstName: userFormRaw.firstName.trim(),
      lastName: userFormRaw.lastName.trim()
    }
  }

  checkLicences() {
    this.manageUserV2service.getValidLicences(this.userType).subscribe(data => {
      if (data.isAuthorisedLicence) {
        this.router.navigateByUrl('/v2/manage-users/new-user');
      }
      else {
        this.router.navigateByUrl('/v2/manage-users')
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

  updateOrganizations(data: IEstablishment[]) {
    const control = this.userForm.get('orgList') as FormArray;
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    data.forEach(option => {
      control.push(this.fb.group({
        id: [option.id],
        organizationName: [option.organizationName],
        lotName: [option.lotName],
        checked: [true],
        isPrimary: [false]
      })
      );
    });
    this.userForm.controls.orgList.setValue(control.value);
    this.userForm.controls['orgList'].updateValueAndValidity();
  }
  
  setPrimary() {
    const organizations = this.userForm.controls.orgList.value;
    if (organizations.length > 0 && !organizations.find(el => el.isPrimary === true)) {
      organizations[0].isPrimary = true;
      this.userForm.get('orgList').setValue(organizations);
    }
  }


}
