import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'select-an-activity-modal',
  templateUrl: './select-an-activity-modal.component.html',
  styleUrls: ['./select-an-activity-modal.component.scss']
})
export class SelectAnActivityModalComponent implements OnInit {
  selectAnActivityForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    public dialogRef: MatDialogRef<SelectAnActivityModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.selectAnActivityForm = this.fb.group({
      activityType: [null, [Validators.required]],
    });
  }

  confirmSelectActivity() {
    this.dialogRef.close(this.selectAnActivityForm.controls['activityType'].value);
  }

  cancelSelectActivity() {
    this.dialogRef.close();
  }

}
