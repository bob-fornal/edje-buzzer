
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { DisplayComponent } from './display.component';

import { MatCardModule } from '@angular/material/card';

import { activatedRouteSpy } from '@shared/_spec-tools/route-spy.spec'

import { Team } from '@core/interfaces/team';

describe('DisplayComponent', () => {
  let component: DisplayComponent;
  let fixture: ComponentFixture<DisplayComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule
      ],
      declarations: [
        DisplayComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expects "ngOnInit" to initialize', () => {
    spyOn(component, 'initApiKey').and.stub();
    spyOn(component, 'initColors').and.stub();

    component.ngOnInit();
    expect(component.initApiKey).toHaveBeenCalled();
    expect(component.initColors).toHaveBeenCalled();
  });

  it('expects "initApiKey" to get the key and set it on the socket service', () => {
    spyOn(component.route.snapshot.paramMap, 'get').and.returnValue('API-KEY');
    spyOn(component.socket, 'setApiKey').and.stub();

    component.initApiKey();
    expect(component.socket.setApiKey).toHaveBeenCalledWith('API-KEY');
  });

  it('expects "initColors" to get the colors and pass to handleColors', () => {
    const colors: string = '_ff0000,_ffff00,_0000ff';
    spyOn(component.route.snapshot.paramMap, 'get').and.returnValue(colors);
    spyOn(component, 'handleColors').and.stub();

    component.initColors();
    expect(component.handleColors).toHaveBeenCalledWith(colors);
  });

  it('expects "handleColors" to take a param and correctly add colors to teams', () => {
    const colors: string = '_ff0000,_ffff00,_0000ff';
    component.teams = [
      { id: '1', title: 'Team 1', color: '' },
      { id: '2', title: 'Team 2', color: '' },
      { id: '3', title: 'Team 3', color: '' }  
    ];
    const expected: Array<Team> = [
      { id: '1', title: 'Team 1', color: '#ff0000' },
      { id: '2', title: 'Team 2', color: '#ffff00' },
      { id: '3', title: 'Team 3', color: '#0000ff' }
    ];

    component.handleColors(colors);
    expect(component.teams).toEqual(expected);
  });

});
