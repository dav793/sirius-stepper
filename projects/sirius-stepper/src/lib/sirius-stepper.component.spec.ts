import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiriusStepperComponent } from './sirius-stepper.component';

describe('SiriusStepperComponent', () => {
  let component: SiriusStepperComponent;
  let fixture: ComponentFixture<SiriusStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiriusStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiriusStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
