import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';

import { ContactManagementRoutingModule } from './contact-management-routing.module';
import { CreateListComponent } from './create-list/create-list.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { AddSenderComponent } from './add-sender/add-sender.component';
import { ImportContactComponent } from './import-contact/import-contact.component';
import { FileUploadedComponent } from './file-uploaded/file-uploaded.component';
import { FileDetailsComponent } from './file-details/file-details.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { TotalContactComponent } from './total-contact/total-contact.component';
import { AllContactsComponent } from './all-contacts/all-contacts.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { OrderModule } from 'ngx-order-pipe';
import { NotificationComponent } from './notification/notification.component';
import { DomainBlockerComponent } from './domain-blocker/domain-blocker.component';



@NgModule({
  declarations: [CreateListComponent, AddContactComponent, AddSenderComponent, ImportContactComponent, FileUploadedComponent, FileDetailsComponent, ContactDetailsComponent, TotalContactComponent, AllContactsComponent, EditContactComponent, NotificationComponent, DomainBlockerComponent],
  imports: [
    CommonModule,
    ContactManagementRoutingModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FormsModule , 
    ReactiveFormsModule,
    OrderModule
  ]
})
export class ContactManagementModule { }
