import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { StaticPageComponent } from './static-page/static-page.component';
import { AuthGuard } from '../helper/auth.guard';

const routes: Routes = [
  {path: 'sidebar', component: SidebarComponent,canActivate: [AuthGuard] },
  {path: 'contact-us', component: ContactUsComponent},
  {path: 'static', component: StaticPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonFilesRoutingModule { }











































