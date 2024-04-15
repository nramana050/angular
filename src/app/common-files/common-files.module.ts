import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { CommonFilesRoutingModule } from './common-files-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { StaticPageComponent } from './static-page/static-page.component';


@NgModule({
  declarations: [SidebarComponent, ContactUsComponent, StaticPageComponent],
  exports : [SidebarComponent ],
  imports: [
    CommonModule,
    CommonFilesRoutingModule,
    FormsModule , 
    ReactiveFormsModule,
  ]
})
export class CommonFilesModule { }
