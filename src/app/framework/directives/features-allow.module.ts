import { NgModule } from '@angular/core';
import { FeatureAllowDirective } from './features-allow.directive';

@NgModule({
    declarations: [ FeatureAllowDirective ],
    exports: [ FeatureAllowDirective ]
  })
  export class FeatureAllowModule {}
