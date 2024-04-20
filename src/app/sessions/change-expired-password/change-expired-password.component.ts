import { ChangeExpiredPasswordService } from './change-expired-password.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { SnackBarService } from '../../framework/service/snack-bar.service';

@Component({
  selector: 'app-change-expired-password',
  templateUrl: './change-expired-password.component.html'
})
export class ChangeExpiredPasswordComponent implements OnInit {

  changeExpiredPasswordForm: FormGroup;
  username: any;
  action = 'submit';

  @ViewChild(MatButton, {static:false}) submitButton: MatButton;
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly changePasswordService: ChangeExpiredPasswordService
    ) { }

  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.initForm();


  }
  navigateHome() {
    this.router.navigateByUrl('/sessions/signin');
  }

  initForm() {
    this.changeExpiredPasswordForm = this.formBuilder.group({
      username: [this.username],
      existingPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
     }, { validators: this.matchingPasswords('newPassword', 'confirmPassword')
    });
  }
  submit() {
      const payload = {
      existingPassword: btoa(this.changeExpiredPasswordForm.controls.existingPassword.value),
      newPassword: btoa(this.changeExpiredPasswordForm.controls.newPassword.value),
      confirmPassword: btoa(this.changeExpiredPasswordForm.controls.confirmPassword.value),
      appId: localStorage.getItem('ApplicationID'),
      clientId: localStorage.getItem('clientId'),
      username: this.changeExpiredPasswordForm.controls.username.value
    }
    this.changePasswordService.sendPasswordChangeDetails(payload).subscribe(data => {
        this.snackBarService.success(`Your password has been changed, please log in with the new password`);
        this.navigateHome();
    },
      error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      });

  }

  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey];
      const passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }
}
