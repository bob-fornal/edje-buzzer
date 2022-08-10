
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
 
import { BaseMessage } from "@core/interfaces/base-message";

import config from '@core/constants/config.json';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  websocket: any;
  PIE_CLUSTER_ID: string = config.pie.CLUSTER_ID;
  PIE_CHANNEL_ID: string = config.pie.CHANNEL_ID;
  PIE_API_KEY: string = '';

  setApiKey = (key: string): void => {
    this.PIE_API_KEY = key
    this.connectWebSocket(WebSocket);
  };

  getPieSocketUrl = (cluster: string, channel: string, apikey: string) => {
    return `wss://${ cluster }.piesocket.com/v3/${ channel }?api_key=${ apikey }&notify_self`;
  };

  connectWebSocket = (_websocket: any): void => {
    const url: string = this.getPieSocketUrl(this.PIE_CLUSTER_ID, this.PIE_CHANNEL_ID, this.PIE_API_KEY);

    try {
      this.websocket = new _websocket(url);
    } catch (error) {
      console.log(error);
    }
  };

  messagesOfType = (type: string): Observable<BaseMessage> => {
    return new Observable(observer => {
      this.websocket.onmessage = (eventString: MessageEvent) => {
        const event: BaseMessage = JSON.parse(eventString.data);
        if (type === '~~ANY~~' || event.type === type) {
          observer.next(event);
        }
      };
    });
  };

  errorHandler = (): Observable<Event> => {
    return new Observable(observer => {
      this.websocket.onerror = (event: Event) => {
        observer.next(event);
      };
    });
  };

  publish = (message: BaseMessage) => {
    try {
      this.websocket.send(JSON.stringify(message));
    } catch (error) {
      console.log(error);
    }
  };

}
