import { TestBed } from '@angular/core/testing';

import { NgAlertbarService } from './ng-alertbar.service';

describe('NgAlertbarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgAlertbarService = TestBed.get(NgAlertbarService);
    expect(service).toBeTruthy();
  });
});
