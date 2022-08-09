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

  it('expects "set" to set an item by key', () => {
    const key: string = 'KEY';
    const value: string = 'VALUE'
    spyOn(service.localstorage, 'setItem').and.stub();

    service.set(key, value);
    expect(service.localstorage.setItem).toHaveBeenCalledWith(key, value);
  });

  it('expects "getWebsocketKey" to get an item by key', () => {
    const key: string = 'pie-socket-key';
    spyOn(service.localstorage, 'getItem').and.returnValue('ITEM');

    const result: any = service.getWebsocketKey();
    expect(service.localstorage.getItem).toHaveBeenCalledWith(key);
    expect(result).toEqual('ITEM');
  });

  it('expects "setWebsocketKey" to get an item by key', () => {
    const key: string = 'pie-socket-key';
    spyOn(service.localstorage, 'setItem').and.stub();

    service.setWebsocketKey('ITEM');
    expect(service.localstorage.setItem).toHaveBeenCalledWith(key, 'ITEM');
  });

});
