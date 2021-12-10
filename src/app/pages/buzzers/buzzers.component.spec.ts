import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuzzersComponent } from './buzzers.component';

describe('BuzzersComponent', () => {
  let component: BuzzersComponent;
  let fixture: ComponentFixture<BuzzersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuzzersComponent ]
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
