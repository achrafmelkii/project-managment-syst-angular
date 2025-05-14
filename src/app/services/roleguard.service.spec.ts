import { TestBed } from '@angular/core/testing';

import { RoleGuard } from './roleguard.service';

describe('RoleguardService', () => {
  let service: RoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
