import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserActivityComponent } from './user-activity.component';
import { MaterialModule } from '../../framework/material/material.module';
import { UserActivityService } from './user-activity.service';


@NgModule({
    imports: [ CommonModule, MaterialModule ],
    declarations: [UserActivityComponent],
    providers: [UserActivityService],
    entryComponents: [UserActivityComponent],
    exports: [ UserActivityComponent ]
  })
  export class UserActivityModule { }
