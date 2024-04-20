import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswordService } from './forgot-password.service';
import { SnackBarService } from './../../framework/service/snack-bar.service';
import { SessionsService } from '../sessions.service';
import { BaseUrl } from 'src/app/framework/constants/url-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly snackBar: SnackBarService,
    private readonly sessionsService: SessionsService
  ) { }

  ngOnInit() {
    this.setInitialData();
    this.initForm();
  }

  initForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      userName: ['', Validators.required]
    });
  }

  submit() {
    const payload = {
      "appId": localStorage.getItem('ApplicationID'),
      "clientId": localStorage.getItem('clientId'),
      "pass": null,
      "userName": this.forgotPasswordForm.controls['userName'].value
    }
    this.forgotPasswordService.sendForgotPassword(payload).subscribe(response => {
      this.snackBar.success('An email has been sent with the next steps to reset your password.')
      this.navigateHome();
    }, error => {
      this.snackBar.error(error.error.applicationMessage);
      this.navigateHome();
    })
  }

  navigateHome() {
    this.router.navigateByUrl('/sessions/signin');
  }

  setInitialData() {
    this.sessionsService.getClientDetails().subscribe(data => {
      if (data.id) {
        localStorage.setItem('clientId', data.id);
        localStorage.setItem('logoPath', data.logoPath);
        localStorage.setItem('ApplicationID', data.appId);
        localStorage.setItem('suAppId', data.serviceUserAppId);
        localStorage.setItem('landingPage', data.landingPageUrl);
        localStorage.setItem('primaryAppColour', data.primaryAppColour);
        localStorage.setItem('secondaryAppColour', data.secondaryAppColour)
        document.documentElement.style.setProperty('--primary-color', data.primaryAppColour);
        document.documentElement.style.setProperty('--secondary-color', data.secondaryAppColour);
      }
    });
  }

}
