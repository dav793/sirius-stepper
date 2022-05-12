import { TestBed } from '@angular/core/testing';

import { SiriusStepperService } from './sirius-stepper.service';

describe('SiriusStepperService', () => {
  let service: SiriusStepperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiriusStepperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
