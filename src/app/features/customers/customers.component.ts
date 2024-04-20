import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from '../../../app/framework/service/snack-bar.service';
import { ICustomer } from './customer.interface';
import { CustomersService } from './customers.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { CustomersNavigation } from './customers.nav';



@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['customer', 'createddate', 'activecustomer', 'actions'];
  dataSource = new MatTableDataSource<ICustomer>();
  sortColumn = 'clientName';
  sortDirection = 'asc';
  pageSize = 10;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private readonly customerService: CustomersService,
    private readonly snackBarService: SnackBarService,
    private readonly rout: ActivatedRoute,
    private readonly inPageNavService: InPageNavService,
    private readonly customerNavigation: CustomersNavigation ) {
      this.inPageNavService.setNavItems(this.customerNavigation.CustomersMenu);
    }

  ngOnInit() {
    this.resolveUsers();
  }

  resolveUsers() {
    this.customerService.getAllCustomers().subscribe(resp => {
      this.dataSource = resp;
    })
  }
  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }
}
