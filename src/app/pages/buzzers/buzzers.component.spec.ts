
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { BuzzersComponent } from './buzzers.component';

import { activatedRouteSpy } from '@shared/_spec/route-spy.spec'

describe('BuzzersComponent', () => {
  let component: BuzzersComponent;
  let fixture: ComponentFixture<BuzzersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BuzzersComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuzzersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
