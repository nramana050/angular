import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { AddCaptrLearnerComponent } from './add-captr-learner.component';
import { FurtherInformationComponent } from './further-information/further-information.component';

const routes: Routes = [
  {
    path: 'further-information',
    component: FurtherInformationComponent,
    data: { title: 'Further information ' , auth:[60,1], identifier:PageTitleIdentifier.Further_information},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCaptrLearnerRoutingModule { }
