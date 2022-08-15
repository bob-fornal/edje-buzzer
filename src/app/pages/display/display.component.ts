
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Team } from '@core/interfaces/team';

import { SocketService } from '@core/services/socket.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  teams: Array<Team> = [
    { id: '1', title: 'Team 1', color: '#ff0000' },
    { id: '2', title: 'Team 2', color: '#ffff00' },
    { id: '3', title: 'Team 3', color: '#0000ff' }
  ];

  constructor(
    public route: ActivatedRoute,
    public socket: SocketService
  ) { }

  ngOnInit(): void {
    this.initApiKey();
    this.initColors();
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

}
