import {
  Directive,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  TemplateRef,
  ViewContainerRef,
  SimpleChanges
} from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { SiriusStepperComponent } from './sirius-stepper.component';

@Directive({
  selector: '[sirius-step]'
})
export class SiriusStepDirective implements OnInit, OnDestroy, OnChanges {

  @Input('link') component: SiriusStepperComponent;
  @Input('step') stepIndex: number;
  @Input('label') stepLabel: string;

  private initialized$ = new ReplaySubject<void>(1);
  private destroyed$ = new ReplaySubject<void>(1);

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnDestroy(): void {
    this.viewContainerRef.clear();
    this.component.unlinkStep(this);
    this.destroyed$.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ( this.component && (this.stepIndex || this.stepIndex === 0) ) {
      this.component.linkStep(this);
      this.initialized$.next();
    }
  }

  ngOnInit(): void {

    this.initialized$.pipe(
      takeUntil(this.destroyed$),
      switchMap(() => this.component.stepControl$)
    ).subscribe(command => {

      if (!command || command.index !== this.stepIndex)
        return;

      if (command.state === 'destroy')
        setTimeout( () => this.viewContainerRef.clear() );
      else if (command.state === 'create')
        setTimeout( () => this.viewContainerRef.createEmbeddedView(this.templateRef) );

    });

  }

}
