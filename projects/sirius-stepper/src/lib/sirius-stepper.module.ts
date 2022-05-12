import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SiriusStepperComponent } from './sirius-stepper.component';
import { SiriusStepDirective } from './sirius-step.directive';

@NgModule({
  declarations: [
    SiriusStepperComponent,
    SiriusStepDirective
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  exports: [
    SiriusStepperComponent,
    SiriusStepDirective
  ],
  entryComponents: [
    SiriusStepDirective
  ]
})
export class SiriusStepperModule { }
