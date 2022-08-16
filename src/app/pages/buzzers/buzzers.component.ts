import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SocketService } from '@core/services/socket.service';

import { BaseMessage } from '@core/interfaces/base-message';
import { Team } from '@core/interfaces/team';
import { ToolsService } from '@core/services/tools.service';

import actions from '@core/constants/actions.json';

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
    public route: ActivatedRoute,
    public socket: SocketService,
    public tools: ToolsService
  ) { }

  ngOnInit(): void {
    this.uuid = this.tools.generateUUID();
    this.initApiKey();
    this.initListening();
  }

  initApiKey = (): void => {
    const key: any = this.route.snapshot.paramMap.get('key');
    this.socket.setApiKey(key);
  };

  initListening = (): void => {
    this.socket.messagesOfType(actions.BUZZER_RESET).subscribe(this.handleBuzzerReset.bind(this));
  };

  setTeam = (team: string): void => {
    this.selectedTeam = team;
  };

  handleSelection = () => {
    this.isSelectionActive = false;
    const message: BaseMessage = {
      type: actions.SELECTED_TEAM,
      payload: {
        uuid: this.uuid,
        username: this.selectedUsername,
        team: this.selectedTeam
      }
    };
    this.socket.publish(message);
  };

  handleBuzzerReset = (): void => {
    this.active = true;
  };

  clickGreenBuzzer = () => {
    if (this.active === false) return;
    
    this.active = !this.active;
    const timeMS: string = (new Date()).getTime().toString();
    const message: BaseMessage = {
      type: actions.CLICKED_BUZZER,
      payload: {
        uuid: this.uuid,
        username: this.selectedUsername,
        team: this.selectedTeam,
        time: timeMS
      }
    };
    this.socket.publish(message);

    this.checkAudio(document);
  };

  checkAudio = (_document: any): void => {
    const username: string = this.selectedUsername.toLocaleLowerCase();
    const isDave: boolean = username.includes('dave') || username.includes('david');
    if (isDave === false) return;

    const files: Array<any> = [
      _document.getElementById('audio-dave-01'),
      _document.getElementById('audio-dave-02'),
      _document.getElementById('audio-dave-03')
    ];
    const randomIndex: number = Math.floor(Math.random() * files.length);
    files[randomIndex].play();
  };

}
