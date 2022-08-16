
import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { LocalstorageService } from '@core/services/localstorage.service';
import { SocketService } from '@core/services/socket.service';

import { BaseMessage } from '@core/interfaces/base-message';
import { Team } from '@core/interfaces/team';

import actions from '@core/constants/actions.json';
import config from '@core/constants/config.json';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {

  version: string = config.version;

  origin: string = '';
  key: string = '';

  term$: Subject<string> = new Subject<string>();

  teams: Array<Team> = [
    { id: '1', title: 'Team 1', value: 'team1', color: '#ff0000', count: 0 },
    { id: '2', title: 'Team 2', value: 'team2', color: '#ffff00', count: 0 },
    { id: '3', title: 'Team 3', value: 'team3', color: '#0000ff', count: 0 }
  ];

  uuids: Array<string> = [];
  users: any = {};

  pages: Array<any> = [
    { title: 'Display', type: 'DISPLAY' },
    { title: 'Buzzers', type: 'BUZZERS' },
    { title: 'Diagnostics', type: 'DIAGNOSTICS' }
  ];

  window: any = window;

  constructor(
    public clipboard: Clipboard,
    public storage: LocalstorageService,
    public socket: SocketService
  ) {
    this.init();
    this.socket.messagesOfType(actions.SELECTED_TEAM).subscribe(this.selectedTeam);
  }

  ngOnInit(): void { }

  init = (): void => {
    this.initCaptureKey();
    this.initCheckForKey();
    this.initOrigin(location);
  };

  initCaptureKey = (): void => {
    this.term$.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(this.handleCapture);
  };

  initCheckForKey = (): void => {
    const storedKey: any = this.storage.getWebsocketKey();
    const assignKey: string = (storedKey === null) ? '' : storedKey;
    this.key = assignKey;
    if (assignKey.length > 0) {
      this.socket.setApiKey(this.key);
    }
  };

  initOrigin = (_location: any): void => {
    this.origin = _location.origin + (_location.pathname + '/#').replace(/\/\//g, '/');
  };

  handleCapture = (data: string): void => {
    this.setCurrentKey(data);
  };

  getURL = (type: string): string => {
    let url: string = '';
    switch (true) {
      case (type === 'DISPLAY'):
        const colors: string = this.teams.map((team: Team): string => team.color.replace('#', '_')).join(',');
        url = `${ this.origin }/edje-display/${ this.key }/${ colors }`;
        break;
      case (type === 'BUZZERS'):
        url = `${ this.origin }/buzzers/${ this.key }`;
        break;
      case (type === 'DIAGNOSTICS'):
        url = `${ this.origin }/diagnostic/${ this.key }`;
        break;
    }
    return url;
  };

  copy = (type: string): void => {
    const url: string = this.getURL(type);
    this.clipboard.copy(url);
  };

  open = (type: string): void => {
    const url: string = this.getURL(type);
    this.window.open(url, '_blank');
  };

  setCurrentKey(key: string): void {
    if (key.length === 0) return;
    this.storage.setWebsocketKey(key);
  }

  selectedTeam = (message: any): void => {
    const uuid: string = message.payload.uuid;
    if (!this.uuids.includes(uuid)) this.uuids.push(uuid);
    this.users[uuid] = message.payload;

    this.countTeams();
  };

  countTeams = (): void => {
    let teamLocations: any = {};
    this.teams.forEach((team: any, index: number): void => {
      team.count = 0;
      teamLocations[team.value] = index;
    });
    this.uuids.forEach((uuid: string): void => {
      const uuidTeam: string = this.users[uuid].team;
      this.teams[teamLocations[uuidTeam]].count!++;
    });
  };

  resetDisplay = (): void => {
    const message: BaseMessage = {
      type: actions.BUZZER_RESET,
      payload: { }
    };
    this.socket.publish(message);
  };

}
