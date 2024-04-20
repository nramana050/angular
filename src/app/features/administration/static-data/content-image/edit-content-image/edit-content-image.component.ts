import { Keywords } from './../../content-keywords/content-keywords.interface';
import { SnackBarService } from '../../../../..//framework/service/snack-bar.service';
import { Router, ActivatedRoute } from "@angular/router";
import { ContentImageService } from "./../content-image.service";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
  FormArray,
} from "@angular/forms";
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete
} from "@angular/material/autocomplete";
import {
  MatChipInputEvent,
  MatChipList
} from "@angular/material/chips";
import { Observable } from "rxjs";
import { map, startWith, tap } from "rxjs/operators";

@Component({
  selector: "app-edit-content-image",
  templateUrl: "./edit-content-image.component.html",
  styleUrls: ["./edit-content-image.component.scss"]
})
export class EditContentImageComponent implements OnInit , AfterViewInit {

  uploadImageForm: FormGroup;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  uploadDisable: Boolean = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  allKeywordsList: string[] = [];
  filteredKeywords: Observable<string[]>;
  imageFile:File;
  keywordInputField = new FormControl();
  private contentId: number;
  isEdit: Boolean = false;
  isNew: Boolean = false;
  logoName: any;
  @ViewChild('keywordInput', {static:false}) keywordInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static:false}) matAutocomplete: MatAutocomplete;
  @ViewChild('chipList', {static:false}) chipList: MatChipList;

  constructor(
    private readonly fb: FormBuilder,
    private readonly contentImageService: ContentImageService,
    private readonly snackbar: SnackBarService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }
 
  ngAfterViewInit() {
    const input = document.querySelector('input');
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
        if (validFileType(file)) {
          para.textContent = file.name;
          listItem.appendChild(para);
        } else {
          para.style.color = 'red';
          para.style.fontSize = '14px';
          para.textContent = 'Not a valid file type. Update your selection.';
          listItem.appendChild(para);
        }
        list.appendChild(listItem);
      }
    }
    const fileTypes = ['image/jpeg', 'image/png'];
    function validFileType(file) {
      for (let i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i]) {
          return true;
        }
      }
      return false;
    }
  }

  ngOnInit() {
    this.getKeyword();
    this.initForm();
    this.filteredKeywords = this.keywordInputField.valueChanges.pipe(
      startWith(null),
      map((kname: string | null) => {
        return kname ? this._filter(kname) : [];
      })
    );
    this.uploadImageForm.get('keyword').statusChanges.subscribe(
      status => this.chipList.errorState = status === 'INVALID'
    );

    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.isNew = false;
        this.contentId = +params['id'];
        this.isEdit = true;
        this.contentImageService.getContentDetails(this.contentId).subscribe(
          resp => {
            const keywords = resp.keywords.split(',');
            keywords.forEach(value => {
            value = value.trim();
              (this.uploadImageForm.get('keyword') as FormArray).push(this.getKeywordForm(value));
            });
          }
        );
      } else {
        this.isNew = true;
      }
    });
  }

  initForm() {
    this.uploadImageForm = this.fb.group({
      file: [null, [Validators.required, Validators.maxLength(100)]],
      keyword: this.fb.array([], [Validators.required, Validators.maxLength(20), this.maxLengthArray(10)]),
    });  
  }

  getKeyword() {
    this.contentImageService.getKeywordList().subscribe(response => {
      this.allKeywordsList = response;
    });
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

  getKeywordForm(keywordName: string) {
    return this.fb.control(keywordName, [Validators.maxLength(20), Validators.pattern('^[a-zA-Z]*$')]);
  }

  fileValidate() {
    const vidFile = (<HTMLInputElement>document.getElementById('image_uploads'))
      .files.length;
    if (vidFile === 0) {
      const preview = document.querySelector('.preview');
      const parat = document.createElement('p');
      parat.textContent = 'No files currently selected for upload';
      preview.appendChild(parat);
    }
  }

  addToList(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    if (!this.matAutocomplete.isOpen && value) {
      (this.uploadImageForm.get('keyword') as FormArray).push(this.getKeywordForm(value));
      if (input) {
        input.value = '';
      }
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    (this.uploadImageForm.get('keyword') as FormArray).push(this.getKeywordForm(event.option.viewValue));
    this.keywordInput.nativeElement.value = '';
  }

  remove(index: number): void {
    (this.uploadImageForm.get('keyword') as FormArray).removeAt(index);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allKeywordsList.filter(
      kname => kname.toLowerCase().indexOf(filterValue) === 0
    );
  }

  onSubmit(data: FormGroup) {
    if(this.isNew) {
      this.createImageKeyword(data.getRawValue());
      this.fileValidate();
    }else {
      this.updateImageKeyword(data.getRawValue());
    }
  }

  createImageKeyword(data) {
    data.keyword = data["keyword"].join(",");
    const formData: FormData = new FormData();
    formData.append("file", this.imageFile);
    formData.append("keyword", data.keyword);
    this.contentImageService.uploadData(formData)
      .then(response => {
        this.navigateHome();
        this.snackbar.success(`Image and keywords uploaded successfully`);
      })
      .catch(error => {
        if (error.status === 0) {
          this.snackbar.error(`Image upload failed, Please try again.`);
        } else {
          this.snackbar.error(JSON.parse(error.response).errorMessage);
        }
      });
  }

  updateImageKeyword(data) {
    data.keyword = data['keyword'].join(',');
    this.contentImageService.updateImageMetaData(this.contentId, data)
      .subscribe(response => {
        this.navigateHome();
        this.snackbar.success(response.applicationMessage);
      }, error => {
        this.snackbar.error(`${error.error.applicationMessage}`);
      });
  }

  selectFile(event) {
    this.logoName = null;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this.validFileType(file)) {
        this.uploadDisable = false;
        this.imageFile = file;
        this.logoName = file.name;
      } else {
        this.uploadDisable = true;
      }
    }
  }

  getErrorMessage() {
    let message = '';
    if (this.uploadImageForm.get('keyword').hasError('required')) {
      message = 'Mandatory field';
    } else if (this.uploadImageForm.get('keyword').hasError('maxLengthArray')) {
      message = 'Maximum 10 keywords are allowed';
    } else if (!this.uploadImageForm.get('keyword').valid) {
      message = 'Special symbols, numbers and space are not allowed';
    }
    return message;
  }

  navigateHome() {
    this.router.navigate(['./administration/content-image']);
  }

  maxLengthArray(max: number) {
    return (c: AbstractControl): { [key: string]: any } => {
      if (c.value.length <= max) {
        return null;
      }
      return { 'maxLengthArray': { valid: false } };
    }
  }
}
