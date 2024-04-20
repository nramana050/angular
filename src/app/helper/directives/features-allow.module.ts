import { NgModule } from '@angular/core';
import { ChangeColorDirective } from './change-color.directive';
import { FeatureAllowDirective } from './features-allow.directive';

@NgModule({
    declarations: [ChangeColorDirective],
    exports: [ChangeColorDirective]
  })
  export class FeatureAllowModule {}
