import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewChatComponent } from './new-chat/new-chat.component';
import { GoToChatComponent } from './go-to-chat/go-to-chat.component';

const routes: Routes = [
  {
    path: 'go-to-chat',
    component: GoToChatComponent,
    data: {  breadcrumb: '', auth: [20]}
  },
  {
    path: 'new-chat',
    component: NewChatComponent,
    data: { title: 'Messages', breadcrumb: '', auth: [20]}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SrmRoutingModule { }
