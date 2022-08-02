import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AudioService } from '@core/services/audio-resolver.service';
import { SocketService } from '@core/services/socket.service';

import { BaseMessage } from '@core/interfaces/base-message';
import { Team } from '@core/interfaces/team';

@Component({
  selector: 'app-buzzers',
  templateUrl: './buzzers.component.html',
  styleUrls: ['./buzzers.component.scss']
})
export class BuzzersComponent implements OnInit {

  active: boolean = true;

  teams: Array<Team> = [
    { id: '0', title: 'Team 1', value: 'team1' },
    { id: '1', title: 'Team 2', value: 'team2' },
    { id: '2', title: 'Team 3', value: 'team3' }
  ];

  isSelectionActive: boolean = true;

  constructor(
    private audio: AudioService,
    private route: ActivatedRoute,
    private socket: SocketService
  ) {
    this.route.params.subscribe(params => {
      const key: string = params['key'];
      this.socket.setApiKey(key);
    });
  }

  ngOnInit(): void {
    this.initListening();
  }

  handleSelection = () => {
    this.isSelectionActive = false;
  };

  initListening = (): void => {
    this.socket.messagesOfType('BUZZER-RESET').subscribe(this.handleBuzzerReset.bind(this));
  };

  handleBuzzerReset = (message: BaseMessage): void => {
    console.log(message);
    this.active = true;
  };

  clickGreenBuzzer = () => {
    if (this.active === false) return;
    
    this.active = !this.active;
    const message: BaseMessage = {
      type: 'CLICKED-BUZZER',
      payload: {
        username: 'BOB',
        time: (new Date()).toUTCString()
      }
    };
    this.socket.publish(message);
  };

}
