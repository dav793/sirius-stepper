import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SiriusStepperComponent } from './sirius-stepper.component';
import { SiriusLogoDirective } from './sirius-logo.directive';
import { SiriusStepDirective } from './sirius-step.directive';

@NgModule({
  declarations: [
    SiriusStepperComponent,
    SiriusLogoDirective,
    SiriusStepDirective
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  exports: [
    SiriusStepperComponent,
    SiriusLogoDirective,
    SiriusStepDirective
  ],
  entryComponents: [
    SiriusLogoDirective,
    SiriusStepDirective
  ]
})
export class SiriusStepperModule { }
