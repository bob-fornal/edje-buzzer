import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SocketService } from '@core/services/socket.service';
import { AudioService } from '@core/services/audio-resolver.service';

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
      console.log(key);
      // this.socket.setApiKey(key);
    });
  }

  ngOnInit(): void { }

  handleSelection = () => {
    this.isSelectionActive = false;
  };

  toggleBuzzer = () => {
    if (this.active === false) return;
    
    this.active = !this.active;
    
    if (this.active === false) {
      const randomIndex = Math.floor(Math.random() * (this.audio.audioFiles.length));
      this.audio.play(randomIndex);  
    }
  };

}
