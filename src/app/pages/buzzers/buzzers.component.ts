import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// import { AudioService } from '@core/services/audio-resolver.service';
import { SocketService } from '@core/services/socket.service';

import { BaseMessage } from '@core/interfaces/base-message';
import { Team } from '@core/interfaces/team';
import { ToolsService } from '@core/services/tools.service';

@Component({
  selector: 'app-buzzers',
  templateUrl: './buzzers.component.html',
  styleUrls: ['./buzzers.component.scss']
})
export class BuzzersComponent implements OnInit {

  active: boolean = true;
  uuid: string = 'xxxx-xxxx-xxxx-xxxx';

  teams: Array<Team> = [
    { id: '0', title: 'Team 1', value: 'team1', color: '#ff0000' },
    { id: '1', title: 'Team 2', value: 'team2', color: '#ffff00' },
    { id: '2', title: 'Team 3', value: 'team3', color: '#0000ff' }
  ];

  isSelectionActive: boolean = true;

  selectedTeam: string = 'team1';
  selectedUsername: string = '';

  constructor(
    // private audio: AudioService,
    public route: ActivatedRoute,
    public socket: SocketService,
    public tools: ToolsService
  ) {
    this.route.params.subscribe(params => {
      const key: string = params['key'];
      this.socket.setApiKey(key);
    });
    this.uuid = this.tools.generateUUID();
  }

  ngOnInit(): void {
    this.initListening();
  }

  setTeam = (team: string): void => {
    this.selectedTeam = team;
  };

  handleSelection = () => {
    this.isSelectionActive = false;
    const message: BaseMessage = {
      type: 'SELECTED-TEAM',
      payload: {
        uuid: this.uuid,
        username: this.selectedUsername,
        team: this.selectedTeam
      }
    };
    this.socket.publish(message);
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
        uuid: this.uuid,
        username: this.selectedUsername,
        time: (new Date()).toUTCString()
      }
    };
    this.socket.publish(message);
  };

}
