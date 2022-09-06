
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { DisplayComponent } from './display.component';

import { MatCardModule } from '@angular/material/card';

import { activatedRouteSpy } from '@shared/_spec-tools/route-spy.spec'

import { Team } from '@core/interfaces/team';

import actions from '@core/constants/actions.json';

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

  it('expects "handleMessage" to take a message and call handleBuzzerReset', () => {
    const message: any = { type: actions.BUZZER_RESET };
    spyOn(component, 'handleBuzzerReset').and.stub();

    component.handleMessage(message);
    expect(component.handleBuzzerReset).toHaveBeenCalled();
  });

  it('expects "handleMessage" to take a message and call handleClickedBuzzer', () => {
    const message: any = { type: actions.CLICKED_BUZZER };
    spyOn(component, 'handleClickedBuzzer').and.stub();

    component.handleMessage(message);
    expect(component.handleClickedBuzzer).toHaveBeenCalled();
  });

  it('expects "handleMessage" to take a message and handle unhandled message', () => {
    const message: any = { type: 'ANYTHING-ELSE' };

    component.handleMessage(message);
    expect(console.log).toHaveBeenCalled();
  });

  it('expects "handleBuzzerReset" to clear the array', () => {
    component.individuals = [
      { uuid: 'UUID', username: 'USERNAME', team: 'TEAM', time: 'TIME' }
    ];

    component.handleBuzzerReset();
    expect(component.individuals).toEqual([]);
  });

  it('expects "handleClickedBuzzer" to not add individual again', () => {
    const individual1: any = { uuid: 'UUID-1', username: 'USERNAME', team: 'TEAM', time: 'TIME' };
    const individual2: any = { uuid: 'UUID-2', username: 'USERNAME', team: 'TEAM', time: 'TIME' };
    component.individuals = [ individual1, individual2 ];

    component.handleClickedBuzzer({ type: 'TYPE', payload: individual2 });
    expect(component.individuals).toEqual([ individual1, individual2 ]);
  });

  it('expects "handleClickedBuzzer" to add an individual', () => {
    const individual1: any = { uuid: 'UUID-1', username: 'USERNAME', team: 'TEAM', time: '1' };
    const individual2: any = { uuid: 'UUID-2', username: 'USERNAME', team: 'TEAM', time: '2' };
    component.individuals = [ individual1 ];

    component.handleClickedBuzzer({ type: 'TYPE', payload: individual2 });
    expect(component.individuals).toEqual([ individual1, individual2 ]);
  });

  it('expects "getTeam" to return the correct value', () => {
    expect(component.getTeam('team1')).toEqual('Team 1');
    expect(component.getTeam('team2')).toEqual('Team 2');
    expect(component.getTeam('team3')).toEqual('Team 3');
  });

  it('expects "getLocalTime" to take a PM time and return correct string', () => {
    const time: string = (1660614240000).toString();
    const pattern: any = /\d{2}\:\d{2}\:\d{2}.\d{3}\s[A|P]M/;

    const result: string = component.getLocalTime(time);
    const match: any = pattern.exec(result);
    expect(match).not.toBeNull();
  });

  it('expects "getLocalTime" to take a AM time and return correct string', () => {
    const time: string = (1660571040000).toString();
    const pattern: any = /\d{2}\:\d{2}\:\d{2}.\d{3}\s[A|P]M/;

    const result: string = component.getLocalTime(time);
    const match: any = pattern.exec(result);
    expect(match).not.toBeNull();
  });

  

});
