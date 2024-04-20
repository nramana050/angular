import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { ManageUserV3Service } from '../manage-user-v3.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { RegexPattern } from 'src/app/framework/constants/regex-constant';
import { IUser } from '../user.interface';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  routeIntent: string;
  refcontract;
  userForm: FormGroup;
  public rolesObjCtrl: FormControl = new FormControl();
  formData: IUser;
  telephoneCodePattern = /^[0-9]*$/;
  namePattern = RegexPattern.namePattern
  emailPattern = RegexPattern.email;
  usernamePattern = /^[a-zA-Z_0-9]*(\.[a-zA-Z_0-9]+)?$/;
  titles = [
    'Mr', 'Mrs', 'Miss', 'Ms', 'Mx', 'Sir', 'Dr', 'Prof', 'Lady', 'Rev', 'Lord', 'Maj',
    'Capt', 'Pte', 'Sgt', 'Ssgt', 'Lt', 'Col', 'Brig', 'Cpl', 'Lcpl', '2Lt', 'WO1', 'WO2', 'Master', 'Other', 'N/A'
  ];
  roles = [];
  newUserTypeId: number;
  manageUserUrl = 'v3/manage-users';
  userType = 2
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly appConfirmService: AppConfirmService,
    private readonly manageUserV3Service: ManageUserV3Service,
    private readonly snackBar: SnackBarService
  ) {
    this.manageUserV3Service.getContractData().subscribe(data => {
      this.refcontract = data;
      console.log(this.refcontract ,"refdata")
    })
   }

  ngOnInit() {
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
      this.manageUserV3Service.getUserTypes().subscribe(userTypes => {
        this.newUserTypeId = userTypes[0].id;
      })
    }
  }

  resolveRoles() {
    this.manageUserV3Service.getUserRoles().subscribe(roles => {
      this.roles = roles;
    })
  }

  initDataForm() {
    this.createUserForm();
  }

  createUserForm() {
    this.userForm = this.fb.group({
      id: '',
      accountType: [null, [Validators.required, Validators.maxLength(35)]],
      accountState: [null],
      title: [null],
      firstName: ['', [Validators.required, Validators.maxLength(100),Validators.pattern(this.namePattern)]],
      lastName: ['', [Validators.required, Validators.maxLength(100),Validators.pattern(this.namePattern)]],
      userName: ['', null],
      emailAddress: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(this.emailPattern)]],
      phoneNumber: [null, [Validators.maxLength(18), Validators.pattern(this.telephoneCodePattern)]],
      userTypeId: null,
      contracts:[[],[Validators.required]]
    });

    if (this.routeIntent === 'editUser') {
      this.activatedRoute.params.subscribe((params: any) => {
        this.manageUserV3Service.getUserDetails(params.id).subscribe(userData => {
          this.formData = userData;
          this.userForm.setValue({
            id: userData.id,
            accountType: userData.accountType,
            accountState: userData.accountState,
            title: userData.title,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userName: userData.emailAddress,
            emailAddress: userData.emailAddress,
            phoneNumber: userData.phoneNumber,
            userTypeId: userData.userTypeId,
            contracts:userData.contracts,
          })
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
    this.manageUserV3Service.updateUser(payload).subscribe(resp => {
      this.snackBar.success(JSON.parse(resp).applicationMessage);
      this.router.navigate([this.manageUserUrl]);
    }, error => {
      this.snackBar.error(error.error.applicationMessage);
    })
  }

  onSaveNewUser(userForm) {
    const payload = this.formatPayload(userForm);
    payload.userTypeId = 2
    this.manageUserV3Service.createUser(payload).subscribe(resp => {
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
      lastName: userFormRaw.lastName.trim(),
      userName: userFormRaw.emailAddress.trim()
    }
  }

  checkLicences() {
    this.manageUserV3Service.getValidLicences(this.userType).subscribe(data => {
      if (data.isAuthorisedLicence) {
        this.router.navigateByUrl('/v3/manage-users/new-user');
      }
      else {
        this.router.navigateByUrl('/v3/manage-users')
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

  get selectedContracts() {
    return this.userForm.get('contracts').value.map((id: number) => {
      const contract = this.refcontract.find(c => c.id === id);
      return contract ? contract.name : '';
    });
  }

  isSelectAllSelected() {
    const selectAllValue = 'selectAll';
    return this.userForm.get('contracts').value.includes(selectAllValue);
  }
  


}


 
  
  
  
  

