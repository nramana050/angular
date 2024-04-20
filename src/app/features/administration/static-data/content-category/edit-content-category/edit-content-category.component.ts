
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ContentCategoryService } from '../content-category.service';
import { Router, ActivatedRoute } from '@angular/router';
import {  MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/internal/operators/tap';
import { ImageUrl } from '../../../../../framework/constants/image--url-constant';
import { SnackBarService } from '../../../../../framework/service/snack-bar.service';
import { ContentManagementService } from '../../../../../features/content-management/content-management.service';
import { Utility } from  '../../../../../framework/utils/utility';


@Component({
  selector: 'app-edit-content-category',
  templateUrl: './edit-content-category.component.html',
  styleUrls: ['./edit-content-category.component.scss']
})
export class EditContentCategoryComponent implements OnInit, AfterViewInit {

  contentCategoryeditForm: FormGroup;
  staticFileData: any;
  categoryNameList: any[];
  subCategoryNameList: any[];
  valueIdentifier: any
  contentImageList: any[];
  pageSize = 12;
  filterBy = { 'keyword': '' , 'categoryId': null };
  public activeElement = 1;
  private categoryId: number;
  public contentImageCtrl: FormControl = new FormControl(null, Validators.required);
  isNew = false;
  clientIdentifier:any;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;

  constructor(
    private readonly categoryService: ContentCategoryService,
    private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly contentCategoryService: ContentCategoryService,
    private readonly contentManagementService: ContentManagementService
    ) { }

  ngOnInit() {
    this.fetchClientDetails();
    this.initDataForm();
    this.getContentCategoryEditFunction();
    this.getSubCategoryEditFunction();

    this.contentCategoryeditForm.controls.levelId.valueChanges.subscribe(value => {
      this.onSelection(value);
    })

    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.categoryId = +params['id'];
        this.resolveImages(this.pageSize, 0, this.filterBy);
        this.contentCategoryService.fetchCategory(this.categoryId).subscribe((data: any) => {
          this.contentCategoryeditForm.patchValue(data);
          this.activeElement = data.imageId;
          this.contentImageCtrl.setValue(data.imageId);
          this.contentCategoryeditForm.controls.levelId.disable();
        }, error => {
          this.snackBarService.error(`${error.error.applicationMessage}`);
          this.navigateHome();
        });
      } else {
        this.isNew = true;
        this.resolveImages(this.pageSize, 0, this.filterBy);
      }
    });
  }

  ngAfterViewInit() {
    this.paginator.pageIndex = 0;
    this.paginator.page.pipe(
      tap(() => this.resolveImages(this.pageSize, this.paginator.pageIndex, this.filterBy))
    ).subscribe();
  }


  selectedItem(item: any) {
    this.contentImageCtrl.setValue(item.id);
    this.activeElement = item.id;
  }

  
  getImagePath(imageName: string) {
    return `${ImageUrl.CONTENT_IMAGE}${this.clientIdentifier}/240_160/${imageName}`;
  }

  onFilter(filterValue: string) {
    this.filterBy.keyword = filterValue;
    this.paginator.pageIndex = 0;
    this.resolveImages(this.pageSize, 0, this.filterBy);
  }

  resolveImages(size, pageIndex, filterBy) {
    filterBy.categoryId = this.categoryId;
    this.categoryService
      .getContentImageList(size, pageIndex, filterBy)
      .subscribe(data => {
        this.contentImageList = data.content;
        this.paginator.length = data.totalElements;
      }, error => this.snackBarService.error(`${error.error.applicationMessage}`));
  }

  onSelection(value) {
    const obj = Utility.getObjectFromArrayByKeyAndValue(this.categoryNameList, 'id', value);
    if(obj) {
      this.valueIdentifier = obj.identifier;

      if(obj.identifier === '1') {
        this.contentCategoryeditForm.removeControl('parentCategoryId');
      } else {
        this.contentCategoryeditForm.addControl('parentCategoryId', new FormControl(null, [Validators.required]));
      }

    }
  }

  getContentCategoryEditFunction() {
    this.categoryService.getcreateMainCategories().subscribe(categoryList => {
      this.categoryNameList = categoryList.menuLevels;
    });
  }

  getSubCategoryEditFunction() {
    this.categoryService.getcreateSubMainCategories().subscribe(subCategoryList => {
      this.subCategoryNameList = subCategoryList;
    });
  }

  removeSpaces(control: AbstractControl) {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
    }
    return null;
  }

  initDataForm() {
    this.contentCategoryeditForm = this.fb.group({
      id: [''],
      categoryName: ['', [Validators.required,this.removeSpaces, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ,.?!"\':;\\-£$%&@#]*$')]],
      levelId: [''],
      levelIdentifier: [''],

    });
  }

  onSubmit(data) {
    if (this.isNew) {
      this.createContentCategory(data);
    } else {
      this.editContentCategory(data);
    }

  }
  createContentCategory(data) {
    data.levelIdentifier = this.valueIdentifier;
    data.imageId = this.activeElement;
    this.categoryService.createCategories(data).subscribe(response => {
      this.snackBarService.success(response.message.applicationMessage);
      this.navigateHome();
    }, error => {
      this.snackBarService.error(`${error.error.applicationMessage}`);
    });
  }

  editContentCategory(data) {

    data.imageId = this.contentImageCtrl.value;
    data.categoryId = this.categoryId;
    this.categoryService.updateCategory(data.id, data).subscribe(response => {
      this.snackBarService.success(response.applicationMessage);
      this.navigateHome();
    }, error => {
      this.snackBarService.error(`${error.error.applicationMessage}`);
    });
  }

  navigateHome() {
    this.router.navigate(['./administration/content-category'])
  }

  async fetchClientDetails(){
    await  this.contentManagementService.getClient().toPromise().then((data:any) => {
      this.clientIdentifier = data.identifier;
    })
   
   }

}
