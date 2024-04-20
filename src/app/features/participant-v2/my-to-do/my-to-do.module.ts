import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyToDoComponent } from './my-to-do.component';



@NgModule({
  declarations: [
    MyToDoComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [MyToDoComponent]
})
export class MyToDoModule { }
