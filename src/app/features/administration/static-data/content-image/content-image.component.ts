import { FormGroup } from '@angular/forms';
import { tap } from 'rxjs/internal/operators/tap';
import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ContentImageService } from './../content-image/content-image.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import {  MatSort } from '@angular/material/sort';
import { ImageUrl } from '../../../../framework/constants/image--url-constant';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';
import { ContentManagementService } from '../../../../features/content-management/content-management.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { AdministrationNavigation } from '../../administration.nav';

@Component({
  selector: 'app-content-image',
  templateUrl: './content-image.component.html',
  styleUrls: ['./content-image.component.scss']
})
export class ContentImageComponent implements OnInit {

  contentImageList: any[];
  selectedImageData: { };
  private contentId: number;
  public contentImageCtrl: FormControl = new FormControl(null, Validators.required);
  sortColumn = '';
  sortDirection = '';
  pageSize = 12;
  filterBy = { 'keyword': '', 'contentId': null };
  public activeElement = 1;
  clientIdentifier:any;

  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  @ViewChild(MatSort , {static:false}) sort: MatSort;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly contentImageService: ContentImageService,
    private readonly snackBarService: SnackBarService,
    public readonly dialog: MatDialog,
    private readonly contentManagementService: ContentManagementService,
    private readonly inPageNavService: InPageNavService,
    private readonly administrationNavigation: AdministrationNavigation
  ) { this.inPageNavService.setNavItems(this.administrationNavigation.administrationPageMenu);
  }


  ngOnInit() {
    this.resolvedate();
  }

 async resolvedate(){
  await this.fetchClientDetails();
    this.route.queryParams.subscribe(params => {
      this.contentId = +params.id;
      this.filterBy.contentId = this.contentId;
      this.resolveImages(this.pageSize, 0, this.filterBy);
  });
  }

  ngAfterViewInit() {
    this.paginator.pageIndex = 0;
    this.paginator.page.pipe(
      tap(() => this.resolveImages(this.pageSize, this.paginator.pageIndex, this.filterBy))
    ).subscribe();
  }


  resolveImages(size, pageIndex, filterBy) {

    this.contentImageService
      .getContentImageList(size, pageIndex, filterBy)
      .subscribe(data => {
        this.contentImageList = data.content;
        this.paginator.length = data.totalElements;
      }, error => this.snackBarService.error(error.error.applicationMessage));
  }

  getImagePath(imageName: string) {
      return `${ImageUrl.CONTENT_IMAGE}${this.clientIdentifier}/original/${imageName}`;
  }

  selectImage(item: any) {
    this.contentImageCtrl.setValue(item.id);
    this.activeElement = item.id;
  }

  onFilter(filterValue: string) {
    this.filterBy.keyword = filterValue;
    this.paginator.pageIndex = 0;
    this.resolveImages(this.pageSize, 0, this.filterBy);
  }

  openDialog(id): void {
    this.contentImageService.getSelectedImage(id).subscribe(
      (dataKey:any) => {
        dataKey.clientIdentifier = this.clientIdentifier;
        this.dialog.open(ImageModalComponent,
          { data: dataKey });
        }, error => this.snackBarService.error(error.error.applicationMessage)
      );
  }

  deleteImage(id) {
    this.contentImageService.deleteImage(id).subscribe(
      response => {
        this.snackBarService.success(response.applicationMessage);
        this.resolveImages(this.pageSize, 0, this.filterBy);
      },
      error => this.snackBarService.error(`${error.error.applicationMessage}`)
    );
  }
  async fetchClientDetails(){
    await  this.contentManagementService.getClient().toPromise().then((data:any) => {
      this.clientIdentifier = data.identifier;
    })
   
   }
   ngOnDestroy(): any {
    this.inPageNavService.setNavItems(null);
  }
}

@Component({
  selector: 'app-image-modal',
  templateUrl: 'image-modal.component.html',
  styleUrls: ['./content-image.component.scss']
})
export class ImageModalComponent implements OnInit {
  imageName;
  keywords;
  imagePath;
  clientIdentifier:any;
  constructor(
    public dialogRef: MatDialogRef<ImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly contentManagementService: ContentManagementService
    ) {
      
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.imageName = this.data.imageName;
    this.imagePath = this.data.imagePath;
    this.keywords = this.data.keywords;
    this.clientIdentifier =  this.data.clientIdentifier;
  }
  
  getImagePath(imageName: string) {
    return `${ImageUrl.CONTENT_BIG_IMAGE}${this.clientIdentifier}/original/${imageName}`;
  }
 
}
