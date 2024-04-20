import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FurtherInformationComponent } from '../../captr-learners/add-captr-learner/further-information/further-information.component';

const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddParticipantRoutingModule { }
