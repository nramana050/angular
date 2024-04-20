import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SrmRoutingModule } from './srm-routing.module';
import { NewChatComponent } from './new-chat/new-chat.component';
import { GoToChatComponent } from './go-to-chat/go-to-chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../framework/material/material.module';
import { SessionsService } from '../shared/services/sessions.service';

@NgModule({
  declarations: [NewChatComponent, GoToChatComponent, ],
  providers: [SessionsService],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    SrmRoutingModule,
 ]
})
export class SrmModule { }



