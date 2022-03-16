import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SocketService } from '@core/services/socket.service';

@Component({
  selector: 'app-buzzers',
  templateUrl: './buzzers.component.html',
  styleUrls: ['./buzzers.component.scss']
})
export class BuzzersComponent implements OnInit {

  active: boolean = true;

  songs: Array<string> = [];

  constructor(
    private route: ActivatedRoute,
    private socket: SocketService
  ) {
    this.route.params.subscribe(params => {
      const key: string = params['key'];
      console.log(key);
      // this.socket.setApiKey(key);
    });
  }

  ngOnInit(): void {
    this.songs = this.route.snapshot.data['songs'];
    console.log(this.songs);
  }

  toggleBuzzer = () => {
    this.active = !this.active;
    
    if (this.active === false) {
      const random = Math.floor(Math.random() * (this.songs.length));
      const audio = <HTMLVideoElement>document.getElementById(`audio--${ random }`);
      audio.play();  
    }
  };

}
