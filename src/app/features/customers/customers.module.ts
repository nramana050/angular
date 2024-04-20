import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../framework/material/material.module';
import { CustomersComponent } from './customers.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { ViewCustomerComponent } from './view-customer/view-customer.component';
import { SharedModule } from '../../framework/shared/shared.module';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';
import { CustomersNavigation } from './customers.nav';


@NgModule({
  declarations: [CustomersComponent, EditCustomerComponent, ViewCustomerComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    FilterPipeModule
  ],
  providers: [CustomersNavigation]
})
export class CustomersModule { }
