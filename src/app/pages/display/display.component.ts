
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SocketService } from '@core/services/socket.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

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
  }

}
