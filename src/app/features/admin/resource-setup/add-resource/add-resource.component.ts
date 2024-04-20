import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RegexPattern } from '../../../../framework/constants/regex-constant';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';
import { IResourceSetup } from '../resource-setup.interface';
import { ResourceSetupService } from '../resource-setup.service';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html'
})
export class AddResourceComponent implements OnInit {
  namePattern = RegexPattern.allCharPattern;
  resourceForm: FormGroup
  resource: IResourceSetup;
  isNew = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private readonly fb: FormBuilder,
    private readonly resourceSetupService: ResourceSetupService,
    private readonly dialogRef: MatDialogRef<AddResourceComponent>,
    private readonly route: Router,
    private readonly snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.resolveResoure();
  }

  onSubmit() {
    this.isNew ? this.createResource() : this.updateResoure();
  }

  dialogClose() {
    this.dialogRef.close();
  }

  createResource() {
    const payload = this.resourceForm.getRawValue();
    this.resourceSetupService.createResource(payload).subscribe(resp => {
      this.dialogRef.close();
      this.snackBarService.success(resp.message.applicationMessage);
    },
      error => {
        this.dialogRef.close();
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  updateResoure() {
    const payload = this.resourceForm.getRawValue();
    this.resourceSetupService.updateResource(payload).subscribe(resp => {
      this.dialogRef.close();
      this.snackBarService.success(resp.message.applicationMessage);
    }, error => {
      this.dialogRef.close();
      this.snackBarService.error(error.error.applicationMessage);
    });
  }

  resolveResoure() {
    this.addResourceForm();
    if (this.data.id) {
      this.isNew = false;
      this.resourceSetupService.getResourceDetails(this.data.id).subscribe((resp: any) => {
        this.resource = resp;
        this.resourceForm.patchValue(this.resource);
      })
    }
  }

  addResourceForm() {
    this.resourceForm = this.fb.group({
      id: [],
      resource: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(this.namePattern)]]
    });
  }

}
