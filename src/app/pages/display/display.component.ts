
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseMessage } from '@core/interfaces/base-message';
import { Individual } from '@core/interfaces/individual';
import { Team } from '@core/interfaces/team';

import { SocketService } from '@core/services/socket.service';

import actions from '@core/constants/actions.json';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  individuals: Array<Individual> = [];

  teams: Array<Team> = [
    { id: '1', title: 'Team 1', color: '#ff0000' },
    { id: '2', title: 'Team 2', color: '#ffff00' },
    { id: '3', title: 'Team 3', color: '#0000ff' }
  ];
  teamMatch: any = {
    team1: 'Team 1',
    team2: 'Team 2',
    team3: 'Team 3'
  }

  constructor(
    public route: ActivatedRoute,
    public socket: SocketService
  ) { }

  ngOnInit(): void {
    this.initApiKey();
    this.initColors();

    this.socket.messagesOfType(actions.ANY_MESSAGE).subscribe(this.handleMessage);  
  }

  initApiKey = (): void => {
    const key: any = this.route.snapshot.paramMap.get('key');
    this.socket.setApiKey(key);
  };

  initColors = (): void => {
    const colors: any = this.route.snapshot.paramMap.get('colors');
    this.handleColors(colors);
  };

  handleColors = (param: string): void => {
    const colors: Array<string> = param.split(',');
    colors.forEach((color: string, index: number): void => {
      this.teams[index].color = color.replace('_', '#');
    });
  };

  handleMessage = (message: BaseMessage): void => {
    switch (true) {
      case (message.type === actions.BUZZER_RESET):
        this.handleBuzzerReset();
        break;
      case (message.type === actions.CLICKED_BUZZER):
        this.handleClickedBuzzer(message);
        break;
      default:
        console.log('unhandled message', message);
        break;
    }
  };

  handleBuzzerReset = (): void => {
    this.individuals = [];
  };

  handleClickedBuzzer = (message: BaseMessage): void => {
    if (this.doesIndividualExist(message.payload.uuid) === true) return;

    this.individuals.push(message.payload);
    this.individuals.sort((a: Individual, b: Individual): number => {
      const a_date = parseInt(a.time, 10);
      const b_date = parseInt(b.time, 10);
      return a_date - b_date;
    });
  };

  getTeam = (team: string): string => this.teamMatch[team];

  getLocalTime = (time: string): string => {
    const ms: number = parseInt(time, 10);
    const date: Date = new Date(ms);

    const hrs = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();
    const mss = date.getMilliseconds();

    const meridian = (hrs > 12) ? 'PM' : 'AM';
    const hours = (hrs > 12) ? hrs - 12 : hrs;
    return `${ (hours+'').padStart(2, '0') }:${ (min+'').padStart(2, '0') }:${ (sec+'').padStart(2, '0') }.${ (mss+'').padStart(3, '0') } ${ meridian }`;
  };

  doesIndividualExist = (uuid: string): boolean => {
    let found: boolean = false;
    for(let i = 0, len = this.individuals.length; i < len; i++) {
      if (this.individuals[i].uuid === uuid) {
        found = true;
        break;
      }
    }
    return found;
  };

}
