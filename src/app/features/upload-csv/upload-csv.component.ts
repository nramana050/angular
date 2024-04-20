import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { OpencsverrorpopupComponent } from './opencsverrorpopup/opencsverrorpopup.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { UploadCsvService } from './upload-csv.service';
import { SnackBarService } from '../../framework/service/snack-bar.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface csvUpload {
  id: number;
  fileName : string;
  createdDate : string;
  uploStatus : string;
  errors : string;
}

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss']
})

export class UploadCsvComponent implements OnInit,AfterViewInit {
  columns: string[] = ['name', 'createdDate', 'status','errors', 'actions'];
  uploadDisable: Boolean = false;
  fileCtrl: FormControl;
  csvFile: File;
  csvUploadForm: FormGroup;
  hideUploadBtn : boolean = false;
  fileSize: number;
  hideError: Boolean = false;
  allData: any;
  pageSize = 10;
  sortColumn = 'createdDate';
  sortDirection = 'desc';
  filterBy = { 'keyword': '' };
  allList: boolean = true;
  totalCount: number;
  json: any;
  dataSource :csvUpload[]=[];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('moduleTable', {static:false}) table: MatTable<csvUpload>;
  
  
  constructor(
    private readonly dialog: MatDialog,
    private readonly fb: FormBuilder,
    private readonly uploadService:UploadCsvService,
    private readonly snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.fetchAllCSV(this.filterBy);
  }

  initForm() {
    this.fileCtrl = new FormControl(null, [Validators.required]);
    this.csvUploadForm = this.fb.group({
      file: [null, [Validators.required]],
    });
  }

  ngAfterViewInit() {
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
        if (validFileType(file) && validFileSize(file)) {
          para.style.color = 'red';
          para.style.fontSize = '14px';
          para.textContent = 'File size exceeds. Update your selection.';
          listItem.appendChild(para);
          this.disableSaveButton = false;
        } 
        else if(validFileSize(file)) {
          para.style.color = 'red';
          para.style.fontSize = '14px';
          para.textContent = 'File size exceeds limit. Update your selection.';
          listItem.appendChild(para);
          this.disableSaveButton = true;
        }
        else if(!validFileType(file)){
          para.style.color = 'red';
          para.style.fontSize = '14px';
          para.textContent = 'Not a valid file type. Update your selection.';
          listItem.appendChild(para);
          this.disableSaveButton = true;
        }
        list.appendChild(listItem);
      }
    }
    const fileTypes = ['text/csv','application/vnd.ms-excel'];

    function validFileType(file) {
      for (let i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i] && file.name.length < 100) {
          return true;
        }
      }
      return false;
    }

    function validFileSize(file) {
      const maxFileSize= 5242880;
      if(file.size > maxFileSize){
         return true;
       }
       return false;
     }
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      const maxSizeError =  document.querySelector('.preview')
      maxSizeError.classList.remove('hideErrorMessage');
      const file = event.target.files[0];
      if (this.validFileType(file) && !this.validFileSize(file)) {
        this.hideUploadBtn = true;
        this.csvFile = file;
      } else {
        this.hideUploadBtn = false;
      }
    }
    this.fileCtrl.setValue(this.csvFile);
  }

  validFileType(file) {
    const fileTypes = ['text/csv','application/vnd.ms-excel'];
    for (let i = 0; i < fileTypes.length; i++) {
      if (file.type === fileTypes[i]) {
        return true;
      }
    }
    return false;
  }

  validFileSize(file) {
    const maxFileSize= 5242880;
    if(file.size > maxFileSize){
       return true;
     }
     return false;
   }

  reset() {
    this.csvUploadForm.get('file').reset();
    this.hideUploadBtn = false;
    const maxSizeError =  document.querySelector('.preview')
      maxSizeError.classList.add('hideErrorMessage');
  }

  uploadDocument() {
    const formData = this.parseData(this.fileCtrl.value);
    this.uploadService.uploadCSV(formData, 'POST')
      .then(res => {
        this.snackBarService.success('CSV uploaded successfully');
        this.fetchAllCSV(this.filterBy);
        this.initForm();
        this.hideUploadBtn = false;
      }).catch(error => {
          this.snackBarService.error(`${error.message.successMessage}`);
      });  
  }

  private parseData(file: File): FormData {
     const formData = new FormData();
     formData.append('file', file);
     return formData;
   }

   private fetchAllCSV(filterBy) {
    this.allList = true;
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }
    this.uploadService
      .getAllCSV(`${this.sortColumn},${this.sortDirection}`, this.pageSize, currentPageIndex, filterBy)
      .subscribe(data => {
        this.dataSource = data.content;
        this.paginator.length = data?.totalElements;
      },
        error => {
          this.snackBarService.error(`${error.error.applicationMessage}`);
        });
  }

  refreshCSV(module:csvUpload){
    this.uploadService.refreshCSV(module.id).subscribe(res => {
      module.uploStatus=res.uploStatus
    });
    this.fetchAllCSV(this.filterBy);
  }

  openDialog(errors) {
    this.json = JSON.parse(errors);
   this.dialog.open(OpencsverrorpopupComponent,{
    data:this.json,
   });
}

  onPaginatorChange() {
    if (this.allList) {
      this.fetchAllCSV(this.filterBy);
    }
    document.querySelector('#upload_csv').scrollIntoView();
  }
}

