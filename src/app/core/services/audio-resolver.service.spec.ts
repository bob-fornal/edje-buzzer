import { TestBed } from '@angular/core/testing';

import { AudioResolverService } from './audio-resolver.service';

describe('AudioResolverService', () => {
  let service: AudioResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
