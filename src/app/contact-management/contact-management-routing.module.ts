import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddContactComponent } from './add-contact/add-contact.component';
import { AddSenderComponent } from './add-sender/add-sender.component';
import { CreateListComponent } from './create-list/create-list.component';
import { ImportContactComponent } from './import-contact/import-contact.component';
import { FileUploadedComponent } from './file-uploaded/file-uploaded.component';
import { FileDetailsComponent } from './file-details/file-details.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { TotalContactComponent } from './total-contact/total-contact.component';
import { AllContactsComponent } from './all-contacts/all-contacts.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { NotificationComponent } from './notification/notification.component';
import { DomainBlockerComponent } from './domain-blocker/domain-blocker.component';
import { from } from 'rxjs';

const routes: Routes = [
  {path: 'add-contact', component: AddContactComponent },
  {path: 'add-sender', component: AddSenderComponent },
  {path: 'create-list', component: CreateListComponent },
  {path: 'import-contact', component: ImportContactComponent },
  {path: 'file-uploaded', component: FileUploadedComponent },
  {path: 'file-details', component: FileDetailsComponent },
  {path: 'contact-details', component: ContactDetailsComponent },
  {path: 'total-contact', component: TotalContactComponent },
  {path: 'all-contacts', component: AllContactsComponent },
  {path: 'edit-contact', component: EditContactComponent },
  {path: 'notification', component: NotificationComponent },
  {path: 'domain-blocker', component: DomainBlockerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactManagementRoutingModule { }
