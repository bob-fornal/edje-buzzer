
import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { LocalstorageService } from '@core/services/localstorage.service';
import { SocketService } from '@core/services/socket.service';

import { Team } from '@core/interfaces/team';

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

  constructor(
    public clipboard: Clipboard,
    public storage: LocalstorageService,
    public socket: SocketService
  ) {
    this.init();
    this.origin = this.getOrigin(location);
    this.socket.setApiKey(this.key);

    this.socket.messagesOfType('SELECTED-TEAM').subscribe(this.selectedTeam);
  }

  ngOnInit(): void { }

  init = (): void => {
    this.term$.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((value: string): void => {
      this.setCurrentKey(value);
    });

    const storedKey: any = this.storage.getWebsocketKey();
    const assignKey: string = (storedKey === null) ? '' : storedKey;
    this.key = assignKey;
  };

  getOrigin = (_location: any): string => {
    const origin: string = (_location.pathname + '/#').replace(/\/\//, '/');
    return _location.origin + origin;
  };

  openDisplay = (): void => {
    const colors: string = this.teams.map((team: Team): string => team.color.replace('#', '_')).join(',');
    const url: string = `${ this.origin }/edje-display/${ this.key }/${ colors }`;
    window.open(url, '_blank');
  };

  copyBuzzer = (): void => {
    const url: string = `${ this.origin }/buzzers/${ this.key }`;
    this.clipboard.copy(url);
  };

  openDiagnostics = (): void => {
    const url: string = `${ this.origin }/diagnostic/${ this.key }`;
    window.open(url, '_blank');
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
    })
    this.uuids.forEach((uuid: string): void => {
      const uuidTeam: string = this.users[uuid].team;
      this.teams[teamLocations[uuidTeam]].count!++;
    });
  };

}
