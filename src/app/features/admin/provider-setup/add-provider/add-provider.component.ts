import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RegexPattern } from '../../../../framework/constants/regex-constant';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';
import { IProvider } from '../provider-setup.interface';
import { ProviderSetupService } from '../provider-setup.service';

@Component({
  selector: 'app-add-provider',
  templateUrl: './add-provider.component.html'
})
export class AddProviderComponent implements OnInit {
  providerNamePattern = RegexPattern.allCharPattern
  codePattern = RegexPattern.allCharPattern
  providerForm: FormGroup;
  provider: IProvider;
  isNew = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private readonly fb: FormBuilder,
    private readonly providerSetupService: ProviderSetupService,
    private readonly dailogRef: MatDialogRef<AddProviderComponent>,
    private readonly route: Router,
    private readonly snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.resolveCustomer();
  }

  onSubmit() {
    this.isNew ? this.createProvider() : this.updateProvider();
  }
  dialogClose() {
    this.dailogRef.close();
  }

  createProvider() {
    const payload = this.providerForm.getRawValue();
    this.providerSetupService.createProvider(payload).subscribe(resp => {
      this.dailogRef.close();
      this.snackBarService.success(resp.message.applicationMessage);
    },
      error => {
        this.dailogRef.close();
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  updateProvider() {
    const payload = this.providerForm.getRawValue();
    if (payload.code === '') {
      payload.code = null;
    } 
    this.providerSetupService.updateProvider(payload).subscribe(resp => {
      this.dailogRef.close();
      this.snackBarService.success(resp.message.applicationMessage);
    }, error => {
      this.dailogRef.close();
      this.snackBarService.error(error.error.applicationMessage);
    });
  }

  resolveCustomer() {
    this.addproviderForm();
    if (this.data.id) {
      this.isNew = false;
      this.providerSetupService.getProviderDetails(this.data.id).subscribe((resp: any) => {
        this.provider = resp;
        this.providerForm.patchValue(this.provider);
      })
    }
  }

  addproviderForm() {
    this.providerForm = this.fb.group({
      id: [],
      providerName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(this.providerNamePattern)]],
      code: [null, [Validators.minLength(3), Validators.maxLength(20), Validators.pattern(this.codePattern)]]
    });
  }

}
