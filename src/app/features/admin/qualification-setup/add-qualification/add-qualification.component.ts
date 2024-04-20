import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RegexPattern } from '../../../../framework/constants/regex-constant';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';
import { IQualificationSetup } from '../qualification-setup.interface';
import { QualificationSetupService } from '../qualification-setup.service';

@Component({
  selector: 'app-add-qualification',
  templateUrl: './add-qualification.component.html'
})
export class AddQualificationComponent implements OnInit {

  namePattern = RegexPattern.allCharPattern;
  codePattern = RegexPattern.allCharPattern;
  qualificationForm: FormGroup
  qualification: IQualificationSetup;
  isNew = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddQualificationComponent>,
    private readonly qualificationSetupService: QualificationSetupService,
    private readonly route: Router,
    private readonly snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.resolveQualification();
  }

  addQualificationForm() {
    this.qualificationForm = this.fb.group({
      id: [],
      qualificationName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(this.namePattern)]],
      qualificationCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(this.codePattern)]]
    });
  }

  resolveQualification() {
    this.addQualificationForm();
    if (this.data.id) {
      this.isNew = false;
      this.qualificationSetupService.getQualificationDetails(this.data.id).subscribe((resp: any) => {
        this.qualification = resp;
        this.qualificationForm.patchValue(this.qualification);
      })
    }
  }

  onSubmit() {
    this.isNew ? this.createQualification() : this.updateQualification();
  }

  dialogClose() {
    this.dialogRef.close();
  }

  createQualification() {
    const payload = this.qualificationForm.getRawValue();
    this.qualificationSetupService.createQualification(payload).subscribe(resp => {
      this.dialogRef.close();
      this.snackBarService.success(resp.message.applicationMessage);
    },
      error => {
        this.dialogRef.close();
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  updateQualification() {
    const payload = this.qualificationForm.getRawValue();
    this.qualificationSetupService.updateQualification(payload).subscribe(resp => {
      this.dialogRef.close();
      this.snackBarService.success(resp.message.applicationMessage);
    }, error => {
      this.dialogRef.close();
      this.snackBarService.error(error.error.applicationMessage);
    });
  }

}
