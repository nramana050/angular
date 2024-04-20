import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationSetupNavigation } from '../../application-setup-nav';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { AddRoleSteps } from '../add-roles.steps';
import { StepperNavigationService } from '../../../shared/components/stepper-navigation/stepper-navigation.service';
import { RegexPattern } from 'src/app/framework/constants/regex-constant';
import { ActivatedRoute, Navigation, NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { RoleCreationService } from '../role-creation.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';

@Component({
  selector: 'app-add-roles',
  templateUrl: './add-roles.component.html',
  styleUrls: ['./add-roles.component.scss']
})
export class AddRolesComponent implements OnInit {
  rolePattern =  /^([^-\s])?[&!\?a-zA-Z0-9-\s]+$/
  roleForm: FormGroup
  disableNextButton: Boolean = false;
  roleId: any;
  isNew: boolean = true;
  responseObj = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly addRoleSteps: AddRoleSteps,
    private readonly router: Router,
    private readonly roleService: RoleCreationService,
    private readonly snackBarService: SnackBarService,
    private readonly route: ActivatedRoute,
    private readonly appConfirmService: AppConfirmService
  ) {
  }

  ngOnInit(): void {
    this.stepperNavigationService.stepper(this.addRoleSteps.stepsConfig);
    this.initForm();
  }

  initForm() {
    this.isNew = true;
    this.roleForm = this.fb.group({
      roleId: [null],
      roleName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(this.rolePattern)]],
      rolesDescription: ['', [Validators.minLength(1), Validators.maxLength(100), Validators.pattern(this.rolePattern)]],
    });

    this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.isNew = false;
        this.roleService.getRoleDetails(params.id).subscribe(resp => {
          this.roleForm.patchValue(resp);
          this.addRoleSteps.stepsConfig[1].enable = false
          if(resp.isCompleted){
            this.addRoleSteps.stepsConfig.forEach(element=>{
              element.enable = false
            })
          }
          else{
            this.addRoleSteps.stepsConfig.forEach((element,i)=>{
              if(i!=0){
                element.enable = true
              }
              
            })
          }
        })
      }
      else{     
        this.addRoleSteps.stepsConfig.forEach(element=>{
          element.enable = true
        })
      }
    })

  }

  onSubmit() {
    this.isNew ? this.createRole() : this.editRole()
  }

  createRole() {
    const payload = this.roleForm.getRawValue();
    this.roleService.createRole(payload).subscribe(resp => {
      this.responseObj = resp;
      this.addRoleSteps.stepsConfig[1].enable = false
      
      this.router.navigate([`/application-setup/role-creation/rbac-permissions`], { queryParams: { id: resp.responseObject.roleId } });
      this.snackBarService.success(resp.message.applicationMessage);
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })

  }

  editRole() {
    const payload = this.roleForm.getRawValue();
    this.roleService.updateRole(payload).subscribe(resp => {
      this.responseObj = resp;
      this.router.navigate([`/application-setup/role-creation/rbac-permissions`], { queryParams: { id: resp.responseObject.roleId } });
      this.snackBarService.success(resp.message.applicationMessage);
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })

  }

  canDeactivate() {
    if (this.roleForm.dirty && this.roleForm.touched && !this.responseObj) {
      return this.appConfirmService.confirm({ title: `Progress not saved`, message: 'If you navigate away from this page your progress will not be saved' });
    }

    return true;
  }
}