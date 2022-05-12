import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AnimationBuilder, style, animate} from "@angular/animations";
import {BehaviorSubject, Observable, of, ReplaySubject} from 'rxjs';
import {distinctUntilChanged, filter, map, switchMap, takeUntil} from 'rxjs/operators';

import { SiriusStepDirective } from './sirius-step.directive';

@Component({
  selector: 'lib-sirius-stepper',
  template: `    
    <ng-container *ngFor="let stepIndex of stepIndexes">
      <button (click)="transitionToStep( stepIndex )">{{ stepIndex }}</button>
    </ng-container>
    
    <div #stepWrapper>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
  ]
})
export class SiriusStepperComponent implements OnDestroy, AfterViewInit {

  @ViewChild('stepWrapper') stepWrapper: ElementRef;

  private _steps$ = new BehaviorSubject<{ [index: string]: SiriusStepDirective }>({});
  private _stepViewIndex$ = new ReplaySubject<number>(1);
  private _stepControl$ = new ReplaySubject<{ index: number, state: 'create'|'destroy' }>(1);
  private _currentStepIndex: number;
  private _animating = false;

  private destroyed$ = new ReplaySubject<void>(1);

  constructor(
    private animBuilder: AnimationBuilder,
    private el: ElementRef
  ) { }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngAfterViewInit() {
    this.init();
    this.setupStepTransitions();
  }

  init() {
    this._steps$.pipe(
      takeUntil(this.destroyed$),
      filter(steps => {
        // filter out empty obj
        return (steps && Object.keys(steps).length > 0) ? true : false;
      })
    ).subscribe(steps => {

      // set first step as active by default
      this._stepViewIndex$.next(
        parseInt( Object.keys(steps)[0] )
      );

    });
  }

  setupStepTransitions() {

    this._stepViewIndex$.pipe(
      takeUntil(this.destroyed$),

      switchMap(stepIndex => {    // fade out last active step (if exists)
        this._animating = true;
        let onStartFadeIn$ = of(stepIndex);

        if (this._currentStepIndex || this._currentStepIndex === 0)
          onStartFadeIn$ = new Observable(obs => {
            const animFactory = this.animBuilder.build(this.fadeOutMetadata);
            const animPlayer = animFactory.create(this.stepWrapper.nativeElement);
            animPlayer.play();
            animPlayer.onDone(() => {
              obs.next(stepIndex);
              obs.complete();
            });
          });

        return onStartFadeIn$;
      }),

      switchMap(stepIndex => {    // fade in new active step
        if (this._currentStepIndex || this._currentStepIndex === 0) {
          this._stepControl$.next({ index: this._currentStepIndex, state: 'destroy' });
          this._currentStepIndex = null;
        }
        this._stepControl$.next({ index: stepIndex, state: 'create' });

        return new Observable(obs => {
          const animFactory = this.animBuilder.build(this.fadeInMetadata);
          const animPlayer = animFactory.create(this.stepWrapper.nativeElement);
          animPlayer.play();
          animPlayer.onDone(() => {
            this._currentStepIndex = stepIndex;
            this._animating = false;
            obs.next(stepIndex);
            obs.complete();
          });
        });
      })
    ).subscribe(() => {});

  }

  get stepControl$(): Observable<{ index: number, state: 'create'|'destroy' }> {
    return this._stepControl$.asObservable();
  }

  get stepIndexes(): number[] {
    return Object.keys(this._steps$.value)
      .map(k => parseInt(k));
  }

  linkStep(step: SiriusStepDirective): void {
    if (!step || (!step.stepIndex && step.stepIndex !== 0))
      throw new Error(`
        Step is missing attribute [step]
        
        [step] should be a number identifying the order in the step sequence
        
        Example: <ng-template [sirius-step] [link]="stepper" [step]="1">
      `);

    const newStep = {};
    newStep[step.stepIndex] = step;

    this._steps$.next(
      Object.assign({}, this._steps$.value, newStep)
    );
  }

  unlinkStep(step: SiriusStepDirective): void {
    if (!step || (!step.stepIndex && step.stepIndex !== 0))
      throw new Error(`
        Step is missing attribute [step]
        
        [step] should be a number identifying the order in the step sequence
        
        Example: <ng-template [sirius-step] [link]="stepper" [step]="1">
      `);

    const newSteps = Object.assign({}, this._steps$.value);
    delete newSteps[step.stepIndex];

    this._steps$.next(newSteps);
  }

  transitionToStep(stepIndex: number): void {
    if (this._animating)
      return;

    const stepIndexes = Object.keys(this._steps$.value);

    if (!stepIndexes.find(i => parseInt(i) === stepIndex))
      throw new Error(`
        Step '${stepIndex}' is not defined
      `);

    this._stepViewIndex$.next(stepIndex);
  }

  private get fadeInMetadata() {
    return [
      style({ opacity: 0 }),
      animate('200ms ease-in', style({ opacity: 1 }))
    ];
  }

  private get fadeOutMetadata() {
    return [
      style({ opacity: '*' }),
      animate('200ms ease-in', style({ opacity: 0 }))
    ];
  }

}
