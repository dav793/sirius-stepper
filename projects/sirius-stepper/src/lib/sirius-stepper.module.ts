import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SiriusStepperComponent } from './sirius-stepper.component';
import { SiriusLogoDirective } from './sirius-logo.directive';
import { SiriusTitleDirective } from './sirius-title.directive';
import { SiriusStepDirective } from './sirius-step.directive';

@NgModule({
  declarations: [
    SiriusStepperComponent,
    SiriusLogoDirective,
    SiriusTitleDirective,
    SiriusStepDirective
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  exports: [
    SiriusStepperComponent,
    SiriusLogoDirective,
    SiriusTitleDirective,
    SiriusStepDirective
  ],
  entryComponents: [
    SiriusLogoDirective,
    SiriusTitleDirective,
    SiriusStepDirective
  ]
})
export class SiriusStepperModule { }
