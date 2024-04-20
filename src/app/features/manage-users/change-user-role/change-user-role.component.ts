import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { ManageUsersComponent } from '../manage-users.component';
import { ManageUsersService } from '../manage-users.service';

@Component({
  selector: 'app-change-user-role',
  templateUrl: './change-user-role.component.html',
  styleUrls: ['./change-user-role.component.scss']
})
export class ChangeUserRoleComponent implements OnInit {

  userForm: FormGroup;
  selectedValue: string = '';
  roles: any[];
  userData: any;
  selectedRole: any;
  activeRoleId: any;
  activeRoleName: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly fb: FormBuilder,
    public dialogRef: MatDialogRef<ManageUsersComponent>,
    private readonly manageUsersService: ManageUsersService,
    private readonly snackBar: SnackBarService,
  ) {
    this.userData = data;
    this.activeRoleName = data.accountType;
  }

  ngOnInit() {
    this.createForm();
    this.initData();
    this.initFormData();
  }

  createForm() {
    this.userForm = this.fb.group({
      id: '',
      accountType: ['', [Validators.required]]
    })
  }

  initData() {
    this.manageUsersService.getUserRoles().subscribe(data => 
      this.roles = data);
  }

  initFormData() {
    this.manageUsersService.getUserDetails(this.userData.id).subscribe(data => {
      const response = { 'id': data.id, 'accountType': data.accountType, 'organisationId': data.organisationId };
      this.userForm.patchValue(response);
      this.selectedRole = data.accountType;
      if (data.accountType) {
        this.patchRole(data.accountType);
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.manageUsersService.changeUserRole(this.userForm.value).subscribe((response: any) => {
        this.dialogRef.close(true);
        this.snackBar.success(response.applicationMessage);
      })
    }
  }

  patchRole(id: any) {
    this.userForm.controls.accountType.setErrors({ invalid: true });
    setTimeout(() => {
      const value = this.roles?.filter(x => x.roleId === id); 
      value.forEach((obj) => {
        this.activeRoleId = obj.roleId;
        this.activeRoleName = obj.roleName;
      });
    }, 100);
  }
  
  onRoleChange(id: string) {
    this.selectedValue = id;
  }

  isRoleDisabled(roleId: number): boolean {
    return this.activeRoleId === roleId;
  }

}
