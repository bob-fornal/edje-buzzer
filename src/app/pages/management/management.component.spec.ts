
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { ManagementComponent } from './management.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Team } from '@core/interfaces/team';

describe('ManagementComponent', () => {
  let component: ManagementComponent;
  let fixture: ComponentFixture<ManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,

        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      declarations: [
        ManagementComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expects "init" to trigger setup', () => {
    spyOn(component, 'initCaptureKey').and.stub();
    spyOn(component, 'initCheckForKey').and.stub();
    spyOn(component, 'initOrigin').and.stub();

    component.init();
    expect(component.initCaptureKey).toHaveBeenCalled();
    expect(component.initCheckForKey).toHaveBeenCalled();
    expect(component.initOrigin).toHaveBeenCalledWith(location);
  });

  it('expects "initCheckForKey" to get the storage value, assign it, and initialize', () => {
    const key: any = 'KEY';
    component.key = '';
    spyOn(component.storage, 'getWebsocketKey').and.returnValue(key);
    spyOn(component.socket, 'setApiKey').and.stub();

    component.initCheckForKey();
    expect(component.key).toEqual(key);
    expect(component.socket.setApiKey).toHaveBeenCalledWith(key);
  });

  it('expects "initCheckForKey" to get the storage value and assign it, if null', () => {
    const key: any = null;
    component.key = '';
    spyOn(component.storage, 'getWebsocketKey').and.returnValue(key);
    spyOn(component.socket, 'setApiKey').and.stub();

    component.initCheckForKey();
    expect(component.key).toEqual('');
    expect(component.socket.setApiKey).not.toHaveBeenCalled();
  });

  it('expects "initOrigin" to build a proper path', () => {
    const location: any = {
      origin: 'ORIGIN',
      pathname: '//PATHNAME'
    };
    const expected: string = 'ORIGIN/PATHNAME/#';
    component.origin = '';

    component.initOrigin(location);
    expect(component.origin).toEqual(expected);
  });

  it('expects "handleCapture" to set current key', () => {
    const data: string = 'DATA';
    spyOn(component, 'setCurrentKey').and.stub();

    component.handleCapture(data);
    expect(component.setCurrentKey).toHaveBeenCalledWith(data);
  });

  it('expects "getURL" to take DISPLAY and return the appropriate URL', () => {
    const type: string = 'DISPLAY';
    const expected: string = 'ORIGIN/edje-display/KEY/_ff0000,_ffff00,_0000ff';
    component.origin = 'ORIGIN';
    component.key = 'KEY';

    const result: string = component.getURL(type);
    expect(result).toEqual(expected);
  });

  it('expects "getURL" to take BUZZERS and return the appropriate URL', () => {
    const type: string = 'BUZZERS';
    const expected: string = 'ORIGIN/buzzers/KEY';
    component.origin = 'ORIGIN';
    component.key = 'KEY';

    const result: string = component.getURL(type);
    expect(result).toEqual(expected);
  });

  it('expects "getURL" to take DIAGNOSTICS and return the appropriate URL', () => {
    const type: string = 'DIAGNOSTICS';
    const expected: string = 'ORIGIN/diagnostic/KEY';
    component.origin = 'ORIGIN';
    component.key = 'KEY';

    const result: string = component.getURL(type);
    expect(result).toEqual(expected);
  });

  it('expects "copy" to take a type, get the URL and copy it', () => {
    const url: string = 'URL';
    spyOn(component, 'getURL').and.returnValue(url);
    spyOn(component.clipboard, 'copy').and.stub();

    component.copy('TYPE');
    expect(component.clipboard.copy).toHaveBeenCalledWith(url);
  });

  it('expects "open" to take a type, get the URL and open it', () => {
    const url: string = 'URL';
    spyOn(component, 'getURL').and.returnValue(url);
    spyOn(component.window, 'open').and.stub();

    component.open('TYPE');
    expect(component.window.open).toHaveBeenCalledWith(url, '_blank');
  });

  it('expects "setCurrentKey" to take a key and do nothing if it is empty', () => {
    const key: string = '';
    spyOn(component.storage, 'setWebsocketKey').and.stub();

    component.setCurrentKey(key);
    expect(component.storage.setWebsocketKey).not.toHaveBeenCalled();
  });

  it('expects "setCurrentKey" to take a key and set it if there is a value', () => {
    const key: string = 'KEY';
    spyOn(component.storage, 'setWebsocketKey').and.stub();

    component.setCurrentKey(key);
    expect(component.storage.setWebsocketKey).toHaveBeenCalledWith(key);
  });

  it('expects "selectedTeam" to take a message and update UUIDs, users, and counts', () => {
    const message: any = { payload: { uuid: 'UUID-1' } };
    component.uuids = [];
    component.users = {};
    spyOn(component, 'countTeams').and.stub();

    component.selectedTeam(message);
    expect(component.uuids).toEqual([ 'UUID-1' ]);
    expect(component.users).toEqual({ 'UUID-1': message.payload });
    expect(component.countTeams).toHaveBeenCalled();
  });

  it('expects "selectedTeam" to take a message and update users and counts', () => {
    const message: any = { payload: { uuid: 'UUID-1', key: 'KEY-2' } };
    component.uuids = [ 'UUID-1' ];
    component.users = { 'UUID-1': { uuid: 'UUID-1', key: 'KEY-1' } };
    spyOn(component, 'countTeams').and.stub();

    component.selectedTeam(message);
    expect(component.uuids).toEqual([ 'UUID-1' ]);
    expect(component.users).toEqual({ 'UUID-1': message.payload });
    expect(component.countTeams).toHaveBeenCalled();
  });

  it('expects "countTeams" to update the counts', () => {
    component.teams = [
      { id: '1', title: 'Team 1', value: 'team1', color: '#ff0000', count: 1 },
      { id: '2', title: 'Team 2', value: 'team2', color: '#ffff00', count: 1 },
      { id: '3', title: 'Team 3', value: 'team3', color: '#0000ff', count: 0 }
    ];
    component.uuids = [ 'UUID-1', 'UUID-2', 'UUID-3' ];
    component.users = {
      'UUID-1': { team: 'team3' },
      'UUID-2': { team: 'team3' },
      'UUID-3': { team: 'team3' }
    };
    const expected: Array<Team> = [
      { id: '1', title: 'Team 1', value: 'team1', color: '#ff0000', count: 0 },
      { id: '2', title: 'Team 2', value: 'team2', color: '#ffff00', count: 0 },
      { id: '3', title: 'Team 3', value: 'team3', color: '#0000ff', count: 3 }
    ];
  
    component.countTeams();
    expect(component.teams).toEqual(expected);
  });

});
