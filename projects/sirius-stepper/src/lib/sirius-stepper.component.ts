import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AnimationBuilder, style, animate } from '@angular/animations';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { SiriusStepDirective } from './sirius-step.directive';

@Component({
  selector: 'lib-sirius-stepper',
  template: `    
    <div class="header">
      
      <div class="brand">
        <ng-content select="[sirius-logo]"></ng-content>
        <ng-content select="[sirius-title]"></ng-content>
      </div>
      
      <div class="ctrlPanel">
        <ng-container *ngFor="let stepIndex of stepIndexes">
          
          <div class="ctrlBtn">
            <div class="gutterTop"></div>
            
            <div class="topWrap">
              <div class="lineLeft"
                [ngClass]="{'invisible': isFirstStep(stepIndex)}" 
                [style]="'border-color: ' + this.getColor(stepIndex)"
              ></div>
              
              <button id="sscb_{{stepIndex}}"
                [style]="'background-color: ' + this.getColor(stepIndex)"
                (click)="transitionToStep( stepIndex )"
              ></button>
              
              <div class="lineRight" 
                [ngClass]="{'invisible': isLastStep(stepIndex)}" 
                [style]="'border-color: ' + this.getColor(stepIndex + 1)"
              ></div>
            </div>
            
            <label for="sscb_{{stepIndex}}"
                 [style]="'color: ' + this.getColor(stepIndex) + '; font-family: ' + this.fontFamily + '; font-size: ' + this.fontSize"
            >{{ getStepLabel(stepIndex) }}</label>  
            
            <div class="gutterBottom"></div>
          </div>
          
        </ng-container>
      </div>
      
    </div>
    
    <div class="step-wrapper" #stepWrapper>
      <ng-content select="[sirius-step]"></ng-content>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      flex-direction: column;
      width: 100%
    }
    
    .brand {
      display: flex; 
      flex-direction: row;
      align-items: center;
      text-align: center;
    }
    
    .ctrlPanel {
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
    
    .ctrlBtn {
      display: flex;
      flex-direction: column;
    }
    
    .ctrlBtn .gutterTop, .ctrlBtn .gutterBottom {
      flex-grow: 1;
    }
    
    .ctrlBtn .topWrap {
      display: flex;
      flex-direction: row;
    }
    
    .ctrlBtn .lineLeft, .ctrlBtn .lineRight {
      flex-grow: 1;
      height: 50%;
      border-bottom: 1px solid black;
    }
    
    .ctrlBtn button {
      width: 12px;
      height: 12px;
      border-radius: 12px;
      border: none;
    }
    
    .ctrlBtn label {
      padding: 8px 12px 0 12px;
      text-align: center;
    }
    
    .step-wrapper {
      position: relative;
    }
    
    .invisible {
      visibility: hidden;
    }

    @media only screen and (min-width: 600px) {
      .header {
        flex-direction: row;
      }
      
      .ctrlPanel {
        justify-content: right;
      }
    }
  `]
})
export class SiriusStepperComponent implements OnDestroy, AfterViewInit {

  @ViewChild('stepWrapper') stepWrapper: ElementRef;
  @Output('step-changes') indexChanges = new EventEmitter<number>(true);
  @Output('steps') indexes = new EventEmitter<number[]>(true);
  @Input('override-step') overrideIndex$: Observable<number>;
  @Input('highlight-color') highlightColor = '#000000';
  @Input('muted-color') mutedColor = '#AAAAAA';
  @Input('font-family') fontFamily = 'Arial';
  @Input('font-size') fontSize = 'inherit';

  private _steps$ = new BehaviorSubject<{ [index: string]: SiriusStepDirective }>({});
  private _stepViewIndex$ = new ReplaySubject<number>(1);
  private _stepControl$ = new ReplaySubject<{ index: number, state: 'create'|'destroy' }>(1);
  private _currentStepIndex: number;
  private _currentStepIndexImmediate: number;
  private _animating = false;

  private destroyed$ = new ReplaySubject<void>(1);

  constructor(
    private animBuilder: AnimationBuilder
  ) { }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngAfterViewInit() {
    this.init();
    this.setupStepTransitions();
  }

  get stepControl$(): Observable<{ index: number, state: 'create'|'destroy' }> {
    return this._stepControl$.asObservable();
  }

  get stepIndexes(): number[] {
    return Object.keys(this._steps$.value)
      .map(k => parseInt(k))
      .sort((a, b) => a - b);
  }

  getStepLabel(stepIndex: number): string {
    return this._steps$.value[stepIndex].stepLabel || '';
  }

  isFirstStep(stepIndex: number): boolean {
    return this.stepIndexes[0] === stepIndex;
  }

  isLastStep(stepIndex: number): boolean {
    return this.stepIndexes[ this.stepIndexes.length-1 ] === stepIndex;
  }

  getColor(stepIndex: number): string {
    return this._currentStepIndexImmediate >= stepIndex ? this.highlightColor : this.mutedColor;
  }

  linkStep(step: SiriusStepDirective): void {
    if (!step || (!step.stepIndex && step.stepIndex !== 0))
      throw new Error(`
        Step is missing attribute [step]
        
        [step] should be a number identifying the order in the step sequence
        
        Example: <ng-template sirius-step [link]="stepper" [step]="1">
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
        
        Example: <ng-template sirius-step [link]="stepper" [step]="1">
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

  private init() {

    this._steps$.pipe(
      takeUntil(this.destroyed$),
      filter(steps => {
        // filter out empty obj
        return (steps && Object.keys(steps).length > 0) ? true : false;
      })
    ).subscribe(steps => {

      setTimeout(() => this.indexes.emit(this.stepIndexes));

      // set first step as active by default
      this._stepViewIndex$.next(
        parseInt( Object.keys(steps)[0] )
      );

    });

    if (!this.overrideIndex$)
      return;
    this.overrideIndex$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(newIndex => {
      if (!newIndex && newIndex !== 0)
        return;
      this.transitionToStep(newIndex)
    });

  }

  private setupStepTransitions() {

    this._stepViewIndex$.pipe(
      takeUntil(this.destroyed$),

      switchMap(stepIndex => {    // fade out last active step (if exists)
        this._animating = true;
        setTimeout(() => {
          this._currentStepIndexImmediate = stepIndex;
          this.indexChanges.emit(stepIndex);
        });

        if (this._currentStepIndex || this._currentStepIndex === 0)
          return this.animate(this.fadeOut)
            .pipe( map(() => stepIndex) );

        return of(stepIndex);
      }),

      switchMap(stepIndex => {    // fade in new active step
        if (this._currentStepIndex || this._currentStepIndex === 0) {
          this._stepControl$.next({ index: this._currentStepIndex, state: 'destroy' });
        }
        this._stepControl$.next({ index: stepIndex, state: 'create' });

        return this.animate(this.fadeIn).pipe(
          tap(() => {
            this._currentStepIndex = stepIndex;
            this._animating = false;
          })
        );
      })
    ).subscribe(() => {});

  }

  private animate(animation: any[]): Observable<void> {
    return new Observable(obs => {
      const animFactory = this.animBuilder.build(animation);
      const animPlayer = animFactory.create(this.stepWrapper.nativeElement);
      animPlayer.play();
      animPlayer.onDone(() => {
        obs.next();
        obs.complete();
      });
    });
  }

  private get fadeIn() {
    return [
      style({ opacity: 0, bottom: -20 }),
      animate('200ms ease-in', style({ opacity: 1, bottom: 0 }))
    ];
  }

  private get fadeOut() {
    return [
      style({ opacity: '*', bottom: '*' }),
      animate('200ms ease-in', style({ opacity: 0, bottom: -20 }))
    ];
  }

}
