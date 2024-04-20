import { Component, OnInit, ViewChild } from '@angular/core';
import { SnackBarService } from '../../../../../framework/service/snack-bar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, FormControl, } from '@angular/forms';
import { ContentKeywordsService } from '../content-keywords.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatChipList} from '@angular/material/chips';


const patternFormat = '^[a-zA-Z]*$';

@Component({
  selector: 'app-edit-keyword',
  templateUrl: './edit-keyword.component.html',
  styleUrls: ['./edit-keyword.component.scss']
})
export class EditKeywordComponent implements OnInit {

  keywordDetailForm:  FormGroup;
  public contactList: FormArray;
  keywords: any[] = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  chipControl: FormControl = new FormControl('', [Validators.required, Validators.pattern(patternFormat)]);
  @ViewChild('chipList', {static:false}) chipList: MatChipList;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private readonly fb: FormBuilder,
    private readonly keywordService: ContentKeywordsService,
    private readonly snackbar: SnackBarService,
    private readonly route: ActivatedRoute,
    private readonly router: Router) {}

  ngOnInit() {
    this.initDataForm();
  }

  initDataForm() {
    this.keywordDetailForm = this.fb.group({
      keywordType: ['Content'],
      keywords: this.fb.array([this.createContact()])
    });
    this.chipList.errorState = false;
  }

  filterArrayByKeyAndValue(keywords: any[], keywordName: any, value: string): any[] {
    return keywords.filter(function (item) {
        return item[keywordName].toLowerCase() === value.toLowerCase();
    });
}

createContact(): FormGroup {
  return this.fb.group({
    keywordName: ['', [Validators.required, Validators.pattern(patternFormat)]]
  });
}

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value === null || value === '') && this.keywords.length === 0 || this.keywords.length >= 30) {
      this.chipList.errorState = true;
      return;
    }
    if (!value.match(patternFormat)) {
      this.chipList.errorState = true;
      return;
    }
    this.chipList.errorState = false;
    if ((value || '').trim()
    && this.filterArrayByKeyAndValue(this.keywords, 'keywordName', value).length === 0 ) {
      this.keywords.push({keywordName: value.trim()});
    }

    if (input) {
      input.value = '';
    }
    if (this.keywords.length <= 30) {
      this.chipList.errorState = false;

    } else {
      this.chipList.errorState = true;
      return;
    }
  }

  createNewKeyword(data) {
    data.value['keywords'] = this.keywords;
    this.keywordService.saveKeyword(data.value).subscribe(response => {
      const valueArr: string[] = this.keywords.map(function(item) { return item.keywordName; });
      this.snackbar.success(`Keyword ${valueArr.join(', ')} has been created`);
      this.navigateHome();
    }, error => {
      this.snackbar.error(`${error.error.applicationMessage}`);
    });
  }

  onSubmit(data) {
    this.createNewKeyword(data);
  }

  navigateHome() {
    this.router.navigate(['./administration/content-keywords']);
  }

  remove(keyword): void {
    const index = this.keywords.indexOf(keyword);

    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
    this.setChipErrorMessage();
  }
  setChipErrorMessage() {
    if (this.keywords.length === 0) {
      this.chipList.errorState = true;
    } else {
      this.chipList.errorState = false;
    }
  }
}
