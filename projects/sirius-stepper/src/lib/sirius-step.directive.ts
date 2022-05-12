import {
  Directive,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  TemplateRef,
  ViewContainerRef,
  SimpleChanges, ElementRef
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
        this.viewContainerRef.clear();
      else if (command.state === 'create')
        this.viewContainerRef.createEmbeddedView(this.templateRef);

    });

  }

  get elementRef(): ElementRef {
    console.log(this.viewContainerRef.element.nativeElement);
    return this.viewContainerRef.element.nativeElement;
    // console.log(this.el.nativeElement);
    // return this.el.nativeElement;
  }

}
