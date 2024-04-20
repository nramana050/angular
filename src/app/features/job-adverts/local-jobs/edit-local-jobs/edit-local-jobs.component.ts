import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalJobsService } from '../local-jobs.service';
import { Utility } from '../../../../framework/utils/utility';
import { Location } from '@angular/common';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../framework/components/date-adapter/date-adapter';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';

@Component({
  templateUrl: './edit-local-jobs.component.html',
  styleUrls: ['./edit-local-jobs.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class EditLocalJobsComponent implements OnInit {
  localJobForm: FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  minStartDate: Date;
  minEndDate: Date;
  isEdit = false;
  jobId;
  allLocationsList;
  isAfterPosting = false;
  filteredLocations: Observable<any[]>;
  disableSaveButton: Boolean = false;
  imageFile: File;
  fileName: string;
  
  constructor(
    private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly localJobsService: LocalJobsService,
    private readonly location: Location
  ) {
    this.getAllLocations();
    this.minStartDate = new Date();
    this.minEndDate = new Date();
    this.minEndDate.setDate(this.minStartDate.getDate() + 1);
    this.route.params.subscribe(params => {
      if (params.hasOwnProperty('jobId')) {
        this.jobId = params.jobId;
      }
    });
  }

  ngOnInit() {
    this.initForm();
    this.filteredLocations = this.localJobForm.get('location').valueChanges
      .pipe(startWith(''), map(val => this.findOption(val)));

    if (this.jobId) {
      this.isEdit = true;
      this.resolveJobData();
    }
  }

  findOption(val: any) {
    if (val && this.allLocationsList) {
      if (val.description) {
        val = val.description
      }
      return this.allLocationsList.filter(option =>
        option.description.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
    return null;
  }

  displayFn(location: any): string {
    return location && location.description ? location.description : '';
  }

  getAllLocations() {
    this.localJobsService.getAllLocations().subscribe((data: any) => {
      this.allLocationsList = data;
    });
  }

  resolveJobData() {
    this.localJobsService.getLocalJob(this.jobId).subscribe((data: any) => {
      this.localJobForm.get('file').clearValidators();
      this.localJobForm.get('file').updateValueAndValidity();
      this.localJobForm.patchValue(data);
      this.localJobForm.get('location').setValue({id:data.locationId, description: data.location});
      if (data.postingDate) {
        this.localJobForm.get('postingDate').setValue(new Date(data.postingDate));
        this.setPostingDateConstraints(new Date(data.postingDate));
      }
      if (data.closingDate) {
        this.localJobForm.get('closingDate').setValue(new Date(data.closingDate));
      }
    }, error => {
      this.location.back();
      this.snackBarService.error(error.error.applicationMessage);
    });
  }

  initForm() {
    this.localJobForm = this.fb.group({
      id: [null],
      jobTitle: [null, [Validators.required, Validators.maxLength(100)]],
      location: [null, [Validators.required, Validators.maxLength(50)]],
      pay: [null, [Validators.required, Validators.maxLength(50)]],
      company: [null, [Validators.required, Validators.maxLength(50)]],
      jobDescription: [null, [Validators.required, Validators.maxLength(1000)]],
      postingDate: [null, [Validators.required]],
      closingDate: [null, [Validators.required]],
      isFeatured: [false],
      file: ['', Validators.required],
      locationId: null,
       imgName:null,

    });
    this.localJobForm.get('postingDate').valueChanges
      .subscribe(date => {
        if (date) {
          this.valueChangesPostingDateConstraints(new Date(date));
        }
      });
    const input = (document.querySelector('input[type=file]') as HTMLInputElement);
    const preview = document.querySelector('.preview');
    input.addEventListener('change', updateImageDisplay);

    function updateImageDisplay() {
      while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
      }

      const curFiles = input.files ? input.files : [];
      const list = document.createElement('div');
      preview.appendChild(list);
      for (const file of curFiles as Array<any>) {
        const listItem = document.createElement('span');
        const para = document.createElement('p');
        if (validFileType(file)&&file.name.length<100) {
          para.textContent = file.name;
          listItem.appendChild(para);
          this.disableSaveButton = false;
        }
        else if(file.name.length>100){
          para.style.color = 'red';
          para.style.fontSize = '14px';
          para.textContent = 'File name too large. Maximum file name length is 100 characters. Please rename and upload again';
          listItem.appendChild(para);
          this.disableSaveButton = true;
        } else {
          para.style.color = 'red';
          para.style.fontSize = '14px';
          para.textContent = 'Not a valid file type. Update your selection.';
          listItem.appendChild(para);
          this.disableSaveButton = true;
        }
        list.appendChild(listItem);
      }
    }
    const fileTypes = ['image/jpeg', 'image/png'];

    function validFileType(file) {
      for (let i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i] && file.name.length <100) {
          return true;
        }
      }
      return false;
    }

  }

  onSubmit() {
    if (this.localJobForm.valid) {
      const payload = this.getPayload();
      const formData = new FormData();
      formData.append('file', this.imageFile);
      if (this.isEdit) {
        formData.append('id', payload.id);
        this.localJobsService.uploadLogoImage(formData).then(
          (data: any) => {
            const imageDetails = JSON.parse(data);
            payload.imgName = imageDetails.imgName;
            payload.path = imageDetails.path;
            this.localJobsService.updateLocalJob(payload).subscribe(data => {
              this.fileValidate();
              this.snackBarService.success('Local  job has been updated successfully!');
              this.onExitClicked();
            },
              error => {
                this.snackBarService.error(error.error.errorMessage);
              }
            );
          });
      } else {
        this.localJobsService.uploadLogoImage(formData).then(
          (data: any) => {
            const imageDetails = JSON.parse(data);
            payload.imgName = imageDetails.imgName;
            payload.path = imageDetails.path;
            this.localJobsService.saveLocalJob(payload).subscribe(data => {
              this.fileValidate();
              this.snackBarService.success('Local job has been added successfully!');
              this.onExitClicked();
            },
              error => {
                this.snackBarService.error(error.error.errorMessage);
              }
            );
        });
      }
    }
  }
  getPayload() {
    const payload = this.localJobForm.getRawValue();
    payload.postingDate = Utility.transformDateToString(payload.postingDate);
    payload.closingDate = Utility.transformDateToString(payload.closingDate);
    if (payload.location.id) {
      payload.locationId = payload.location.id;
      payload.location = payload.location.description;
    } else {
      payload.locationId = null;
    }
    return payload;
  }

  valueChangesPostingDateConstraints(date?: Date) {
    const today = new Date();
    if (!this.isEdit) {
      this.minEndDate = new Date(date);
      this.minEndDate.setDate(date.getDate() + 1);
    } else {
      this.minStartDate.setTime(today.getTime());
      date < today ? this.minEndDate = new Date(today) :
        this.minEndDate = new Date(date);
      this.minEndDate.setDate(this.minEndDate.getDate() + 1);
      this.localJobForm.get('closingDate').markAsTouched();
    }
    const postingDate = Utility.transformDateToString(this.localJobForm.get('postingDate').value);
    const closingDate = Utility.transformDateToString(this.localJobForm.get('closingDate').value);
    this.isAfterPosting = new Date(postingDate) >= new Date(closingDate);
  }

  setPostingDateConstraints(date?: Date) {
    const today = new Date();
    this.minStartDate < today ? this.minStartDate = new Date(today) :
      this.minStartDate = new Date(date);
    this.minStartDate > today ? this.minStartDate.setTime(today.getTime()) :
      this.minStartDate.setTime(date.getTime());
  }
  
  onExitClicked() {
    this.location.back();
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this.validFileType(file)&& file.name.length <100) {
        this.disableSaveButton = false;
        this.imageFile = file;
      } else {
        this.disableSaveButton = true;
      }
    }
  }

  validFileType(file) {
    const fileTypes = ['image/jpeg', 'image/png'];
    for (let i = 0; i < fileTypes.length; i++) {
      if (file.type === fileTypes[i]) {
        return true;
      }
    }
    return false;
  }
  fileValidate() {
    const vidFile = (document.getElementById('image_uploads') as HTMLInputElement)
      .files.length;
    if (vidFile === 0) {
      const preview = document.querySelector('.preview');
      const parat = document.createElement('p');
      parat.textContent = 'No files currently selected for upload';
      preview.appendChild(parat);
    }
  }

}
