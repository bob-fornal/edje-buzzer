import { TestBed } from '@angular/core/testing';

import { LocalstorageService } from './localstorage.service';

describe('LocalstorageService', () => {
  let service: LocalstorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalstorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('expects "get" to get an item by key', () => {
    const key: string = 'KEY';
    spyOn(service.localstorage, 'getItem').and.returnValue('ITEM');

    const result: string = service.get(key);
    expect(result).toEqual('ITEM');
  });

});
