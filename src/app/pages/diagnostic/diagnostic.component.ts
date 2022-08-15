import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { SocketService } from '@core/services/socket.service';

import { BaseMessage } from '@core/interfaces/base-message';

import actions from '@core/constants/actions.json';

@Component({
  selector: 'app-diagnostic',
  templateUrl: './diagnostic.component.html',
  styleUrls: ['./diagnostic.component.scss']
})
export class DiagnosticComponent implements OnInit {

  @ViewChild('jsonInput') jsonInput: ElementRef;

  key: string = '';
  responses: Array<string> = [];

  defaultBaseObject: BaseMessage = {
    type: '',
    payload: {}
  };

  setTimeout: any = setTimeout;

  constructor(
    public route: ActivatedRoute,
    public socket: SocketService
  ) { }

  ngOnInit(): void {
    this.initApiKey();
    this.setTimeout(this.initProcesses, 1000);

    this.socket.messagesOfType(actions.ANY_MESSAGE).subscribe(this.handleMessage.bind(this));
  }

  initApiKey = (): void => {
    const key: any = this.route.snapshot.paramMap.get('key');
    this.socket.setApiKey(key);
  };

  initProcesses = () => {
    this.jsonInput.nativeElement.value = JSON.stringify(this.defaultBaseObject);
  };

  sendMessage = (content: string): void => {
    const message: BaseMessage = JSON.parse(content);
    this.socket.publish(message);
  };

  handleMessage = (message: BaseMessage): void => {
    this.responses.push(JSON.stringify(message));
  };

}
