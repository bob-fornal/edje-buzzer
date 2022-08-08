import { TestBed } from '@angular/core/testing';

import { ToolsService } from './tools.service';

describe('ToolsService', () => {
  let service: ToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('expects "generateUUID" to generate a uniue string', () => {
    const result: string = service.generateUUID();
    expect(result).not.toEqual('xxxx-xxxx-xxxx-xxxx');
    expect(result.length).toEqual(19);
  });
});
