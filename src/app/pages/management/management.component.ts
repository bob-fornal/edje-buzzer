
import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { LocalstorageService } from '@core/services/localstorage.service';
import { SocketService } from '@core/services/socket.service';

import { Team } from '@core/interfaces/team';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {

  origin: string = '';
  key: string = '';

  term$: Subject<string> = new Subject<string>();

  teams: Array<Team> = [
    { id: '1', title: 'Team 1' },
    { id: '2', title: 'Team 2' },
    { id: '3', title: 'Team 3' }
  ];

  constructor(
    public clipboard: Clipboard,
    public storage: LocalstorageService,
    public socket: SocketService
  ) {
    this.init();
    this.origin = this.getOrigin(location);
    // this.socket.setApiKey(this.key);
  }

  ngOnInit(): void { }

  init = (): void => {
    this.term$.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((value: string): void => {
      this.setCurrentKey(value);
    });

    const storedKey: any = this.storage.getKey();
    const assignKey: string = (storedKey === null) ? '' : storedKey;
    this.key = assignKey;
  };

  getOrigin = (_location: any): string => {
    const origin: string = (_location.pathname + '/#').replace(/\/\//, '/');
    return _location.origin + origin;
  };

  copyDisplay = (): void => {
    const url: string = `${ this.origin }/edje-display/${ this.key }`;
    this.clipboard.copy(url);
  };

  copyBuzzer = (): void => {
    const url: string = `${ this.origin }/buzzers/${ this.key }`;
    this.clipboard.copy(url);
  };

  openDiagnostics = (): void => {
    const url: string = `${ this.origin }/diagnostic/${ this.key }`;
    console.log(url);
    window.open(url, '_blank');
  };
  
  setCurrentKey(key: string): void {
    if (key.length === 0) return;

    this.storage.setKey(key);
  }

}
