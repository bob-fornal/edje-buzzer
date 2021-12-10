
import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { SocketService } from '@core/services/socket.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {

  origin: string = '';
  key: string = 'kbfzwq1taOwqDyw7GjgDZDZCd6QByYU8uC2B6kGj';

  constructor(
    private clipboard: Clipboard,
    private socket: SocketService
  ) {
    this.origin = location.origin;
    // this.socket.setApiKey(this.key);
  }

  ngOnInit(): void { }

  copyDisplay = (): void => {
    const url: string = `${ this.origin }/edje-display/${ this.key }`;
    this.clipboard.copy(url);
  };

  copyBuzzer = (): void => {
    const url: string = `${ this.origin }/buzzers/${ this.key }`;
    this.clipboard.copy(url);
  };

}
