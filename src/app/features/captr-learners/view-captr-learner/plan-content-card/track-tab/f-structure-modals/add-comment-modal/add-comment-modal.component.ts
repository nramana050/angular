import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-comment-modal',
  templateUrl: './add-comment-modal.component.html',
  styleUrls: ['./add-comment-modal.component.scss']
})
export class AddCommentModalComponent implements OnInit {
  addCommentForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    public dialogRef: MatDialogRef<AddCommentModalComponent>,
   
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.addCommentForm = this.fb.group({
      comment: [null, [Validators.required, Validators.maxLength(200)]],
    });
  }

  confirmAddComment() {
    this.dialogRef.close(this.addCommentForm.value);
  }

  cancelAddComment() {
    this.dialogRef.close();
  }

}
