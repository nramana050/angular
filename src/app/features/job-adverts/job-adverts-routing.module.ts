import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JobAdvertsRoutes } from './job-adverts-routes';


@NgModule({
  imports: [RouterModule.forChild(JobAdvertsRoutes)],
  exports: [RouterModule]
})
export class JobAdvertsRoutingModule { }
