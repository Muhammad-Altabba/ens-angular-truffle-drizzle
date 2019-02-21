import { TestBed, inject } from '@angular/core/testing';

import { DrizzleService } from './drizzle.service';

describe('DrizzleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrizzleService]
    });
  });

  it('should be created', inject([DrizzleService], (service: DrizzleService) => {
    expect(service).toBeTruthy();
  }));
});
