import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ManageOrganisationsService } from './manage-organisations.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ApplicationSetupNavigation } from '../application-setup/application-setup-nav';

@Component({
  selector: 'app-manage-organisations',
  templateUrl: './manage-organisations.component.html',
  styleUrls: ['./manage-organisations.component.scss']
})
export class ManageOrganisationsComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['organizationName', 'officeNumber', 'officeEmail', 'dateCreated', 'addedBy', 'actions'];
  dataSource = new MatTableDataSource();
  sortColumn = 'organizationName';
  sortDirection = 'asc';
  pageSize = 15;
  filterBy = {'keyword': ''};

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly manageOrganisationsService: ManageOrganisationsService,
    private readonly inPageNavService: InPageNavService,
    private readonly applicationSetupNavigation: ApplicationSetupNavigation,
  ) { 
    this.inPageNavService.setNavItems(this.applicationSetupNavigation.appSetupSubMenu);
  }

  ngOnInit() {
    this.resolveOrganisations(this.filterBy);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(data => {
      this.sortColumn = data.active;
      this.sortDirection = data.direction;
      this.paginator.pageIndex = 0;
      this.resolveOrganisations(this.filterBy);
    });

    this.paginator.page.pipe(
      tap(() => {
        this.resolveOrganisations(this.filterBy);
        document.querySelector('#organisations').scrollIntoView();
      })
    )
    .subscribe();
  }

  resolveOrganisations(filterBy) {
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }

    this.manageOrganisationsService.findAllPaginated(`${this.sortColumn},${this.sortDirection}`, currentPageIndex, this.pageSize, filterBy).subscribe(data => {
      this.dataSource.data = data.content;
      this.paginator.length = data.totalElements;
      this.dataSource.sort = this.sort;
    });
  }

  onFilter(filterValue: string) {
    this.filterBy.keyword = filterValue;
    this.paginator.pageIndex = 0;
    this.resolveOrganisations(this.filterBy);
  }

  onEditClicked(id): void {
    this.router.navigate([`./edit-organisation/${id}`], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }
}
