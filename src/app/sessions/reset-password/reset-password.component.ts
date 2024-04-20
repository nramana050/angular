import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from './../../framework/service/snack-bar.service';
import { ResetPasswordService } from './reset-password.service';
import { SessionsService } from '../sessions.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

  private token: string;
  resetPasswordForm: FormGroup;
  action = 'forgot';
  clientDetails;

  constructor(
    public readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly sessionsService: SessionsService
  ) { }

  ngOnInit() {
    this.resolveToken();
    this.setTitle();
    this.initForm();
  }

  resolveToken() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.token) {
        this.token = params.token;
        const payload = {
          confirmPassword: null,
          encryptedToken: this.token,
          initialPassword: null
        };
        this.resetPasswordService.validatePasswordLink(payload).subscribe(response => {
          if (response == null || response['token'] == null) {
            this.snackBarService.error(`Invalid token`);
            this.navigateHome();
          }
        }, error => {
          this.snackBarService.error(error.error.applicationMessage);
          this.navigateHome();
        })
      } else {
        this.snackBarService.error(`Invalid token`);
        this.navigateHome();
      }
    });
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.action && params.action === 'create') {
        this.route.snapshot.data['title'] = 'Set Password';
        this.action = 'create';
      } else {
        this.route.snapshot.data['title'] = 'Reset Password';
      }
    });
  }

  initForm() {
    this.resolveClientData();
    this.resetPasswordForm = this.formBuilder.group({
      encryptedToken: [this.token],
      initialPassword: ['', Validators.compose(
        [
          Validators.maxLength(36),
          Validators.minLength(8),
          Validators.pattern(/(?=.*\d)(?=.*[a-zA-Z])(?=.*[!\"#$%&\'\(\)\*+,-\.\/:;<=>\?@\[\\\]^_`{|}~])/)
        ]
      )],
      confirmPassword: [''],
      clientId:[localStorage.getItem('clientId')]
    }, { validators: this.matchingPasswords('initialPassword', 'confirmPassword') })
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

  submit() {
    let payload = this.resetPasswordForm.getRawValue();
    payload.clientId = this.clientDetails.id;
    this.resetPasswordService.validateAndSavePassword(payload).subscribe(response => {
      if (this.action === 'create') {
        this.snackBarService.success('Your account has now been created, you may now login to the system.');
      } else {
        this.snackBarService.success('Your password has been reset, please log in.');
      }
      this.navigateHome();
    }, error => {
      this.snackBarService.error(error.error.applicationMessage);
    })
  }

  navigateHome() {
    this.router.navigateByUrl('/sessions/signin');
  }
  
  resolveClientData() {
    this.sessionsService.getClientDetails().subscribe(data => {
      if (data.id) {
          this.clientDetails = data;
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
