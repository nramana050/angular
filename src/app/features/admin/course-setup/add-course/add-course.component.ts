import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RegexPattern } from '../../../../framework/constants/regex-constant';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';
import { ICourseSetup } from '../course-setup.interface';
import { CourseSetupService } from '../course-setup.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['add-course.component.scss']
})
export class AddCourseComponent implements OnInit {
  courseNamePattern = RegexPattern.allCharPattern
  codePattern = RegexPattern.allCharPattern
  glhPattern = RegexPattern.allIntegers
  courseForm: FormGroup
  course: ICourseSetup;
  isNew = true;
  types = ['Accredited', 'Unaccredited']

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private readonly fb: FormBuilder,
    private readonly courseSetupService: CourseSetupService,
    private readonly route: Router,
    private readonly dailogRef: MatDialogRef<AddCourseComponent>,
    private readonly snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.resolveCourse();
  }

  addcourseForm() {
    this.courseForm = this.fb.group({
      id: [],
      courseName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(this.courseNamePattern)]],
      courseCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(this.codePattern)]],
      courseType: ['', [Validators.required]],
      glh:['', [Validators.maxLength(4), Validators.pattern(this.glhPattern)]],
    });
  }

  resolveCourse() {
    this.addcourseForm();
    if (this.data.id) {
      this.isNew = false;
      this.courseSetupService.getCourseDetails(this.data.id).subscribe((resp: any) => {
        this.course = resp;
        this.courseForm.patchValue(this.course);
      })
    }
  }

  onSubmit() {
    this.isNew ? this.createCourse() : this.updateCourse();
  }

  dialogClose() {
    this.dailogRef.close();
  }

  createCourse() {
    const payload = this.courseForm.getRawValue();
    this.courseSetupService.createCourse(payload).subscribe(resp => {
      this.dailogRef.close();
      this.snackBarService.success(resp.message.applicationMessage);
    },
      error => {
        this.dailogRef.close();
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  updateCourse() {
    const payload = this.courseForm.getRawValue();
    this.courseSetupService.updateCourse(payload).subscribe(resp => {
      this.dailogRef.close();
      this.snackBarService.success(resp.message.applicationMessage);
    }, error => {
      this.dailogRef.close();
      this.snackBarService.error(error.error.applicationMessage);
    });
  }

}
