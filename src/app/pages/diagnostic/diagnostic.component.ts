import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { SocketService } from '@core/services/socket.service';

import { BaseMessage } from '@core/interfaces/base-message';

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

  constructor(
    public route: ActivatedRoute,
    public socket: SocketService
  ) {
    this.route.params.subscribe(params => {
      const key: string = params['key'];
      console.log(key);
      this.socket.setApiKey(key);
    });

  }

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.jsonInput.nativeElement.value);
      this.jsonInput.nativeElement.value = JSON.stringify(this.defaultBaseObject);
      this.initListening();
    }, 1000);
  }

  initListening = (): void => {
    this.socket.messagesOfType('~~ANY~~').subscribe(this.handleMessage.bind(this));
  };

  sendMessage = (content: string): void => {
    console.log(content);
    const message: BaseMessage = JSON.parse(content);
    this.socket.publish(message);
  };

  handleMessage = (message: BaseMessage): void => {
    console.log(message);
    this.responses.push(JSON.stringify(message));
  };

}
