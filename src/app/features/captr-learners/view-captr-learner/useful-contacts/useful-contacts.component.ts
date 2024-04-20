import { AfterViewInit, Component, OnInit, ViewChild ,OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../learner-nav';
import { MatTableDataSource } from '@angular/material/table';
import { IUsefulContact } from './usefulContact.interface';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { tap } from 'rxjs/operators';
import { CaptrLearnersService } from '../../captr-learners.services';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { ParticipantNavigation } from 'src/app/features/participant-v2/view-participant/participant-nav';

@Component({
  selector: 'app-useful-contacts',
  templateUrl: './useful-contacts.component.html',
  styleUrls: ['./useful-contacts.component.scss']
})

export class UsefulContactsComponent implements OnInit, AfterViewInit, OnDestroy {
  usefulcontacts: boolean;

  displayedColumns: string[] = ['dateAdded', 'workerName', 'organisation', 'telePhone', 'emailAddress', 'address', 'notes', 'actions'];
  dataSource = new MatTableDataSource<IUsefulContact>();
  sortColumn = 'workerName';
  sortDirection = 'asc';
  pageSize = 10;
  serviceUserId: any;
  filterBy: any = { 'keyword': null };
  url;
  fname: string;
  userId: number;
  readonly CAPTR_URL = 'captr-learner';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  name: any;
  profileUrl;

  constructor(
    private readonly router: Router,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly snackBarService: SnackBarService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly appConfirmService: AppConfirmService,
    private readonly sessionService: SessionsService,
    private readonly route: ActivatedRoute,
   

  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
     this.setTitle();
      this.usefulContactsTabs('usefulContacts');
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.serviceUserId = params.id;
      this.name = params.name;
    });
    this.filterBy = { 'keyword': '', 'serviceUserId': this.serviceUserId }
  }


  ngOnInit(): void {
    this.resolveUsers(this.filterBy);
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.fname = params.name;
      this.userId = params.id;
      (this.route.snapshot.data as { title: string }).title = `${this.fname}`;
    });
  }

  ngAfterViewInit() {

    this.sort&&this.sort.sortChange.subscribe(data => {
      this.sortColumn = data.active;
      this.sortDirection = data.direction;
      this.paginator.pageIndex = 0;
      this.resolveUsers(this.filterBy);
    });

    this.paginator.page
      .pipe(
        tap(() => {
          this.resolveUsers(this.filterBy);
        })
      )
      .subscribe();
  }
  resolveUsers(filterBy) {
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }
    this.captrLearnersService.findAllUsefulContact(`${this.sortColumn},${this.sortDirection}`, currentPageIndex, this.pageSize, filterBy)
      .subscribe(data => {
        if (data.content.length == 0) {
          this.usefulcontacts = false;
        } else {
          this.usefulcontacts = true;
          this.dataSource = data.content;
          this.paginator.length = data.totalElements;
          this.dataSource.sort = this.sort;
        }
      }, error => {
        this.snackBarService.error(error.error.applicationMessage);
      });
  }

  onFilter(filterString: string) {
    this.filterBy.keyword = filterString;
    this.paginator.pageIndex = 0;
    this.resolveUsers(this.filterBy);
  }

  onExitClicked() {
    this.router.navigate([this.profileUrl+'/participant-professional-view'],  { queryParamsHandling :"merge"});
  }

  usefulContactsTabs(tabName: string) {
    switch (tabName) {
      case 'usefulContacts':
        this.usefulcontacts = true;
        break;
    }
  }

  onDelete(id) {
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete Contact`,
      message: `Are you sure you want to delete this contact?`
    });
    dialogRef.subscribe(result => {
      if (result) {
        this.captrLearnersService.deleteUsefulContact(id).subscribe(
          response => {
          this.snackBarService.success(response.applicationMessage);
          this.paginator.firstPage();
          this.resolveUsers(this.filterBy);
        },
         error => this.snackBarService.error(error.error.applicationMessage)
        );
      }
    });
  }

  isAuthorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }
  
  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

}
