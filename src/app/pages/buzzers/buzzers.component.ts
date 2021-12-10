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

  ngOnInit(): void { }

  toggleBuzzer = () => {
    this.active = !this.active;
  };

}
