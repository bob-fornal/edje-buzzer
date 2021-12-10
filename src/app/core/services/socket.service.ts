
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
 
import { BaseMessage } from "@core/interfaces/base-message";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private websocket: any;
  private PIE_CLUSTER_ID: string = 'us-nyc-2';
  private PIE_CHANNEL_ID: string = '1';
  private PIE_API_KEY: string = '';

  constructor() {
  }

  public setApiKey = (key: string): void => {
    this.PIE_API_KEY = key
    this.connectWebSocket();
  };

  private getPieSocketUrl = (cluster: string, channel: string, apikey: string) => `wss://${ cluster }.piesocket.com/v3/${ channel }?api_key=${ apikey }`;
  private useSocketAWS: boolean = true;

  private connectWebSocket = (): void => {
    const url: string = this.getPieSocketUrl(this.PIE_CLUSTER_ID, this.PIE_CHANNEL_ID, this.PIE_API_KEY);

    try {
      this.websocket = new WebSocket(url);
    } catch (error) {
      console.log(error);
    }
  };

  public messagesOfType = (type: string): Observable<BaseMessage> => {
    return new Observable(observer => {
      this.websocket.onmessage = (eventString: MessageEvent) => {
        console.log('onmessage', eventString.data);
        const event: BaseMessage = JSON.parse(eventString.data);
        if (event.type === type) {
          observer.next(event);
        }
      };
    });
  };

  public errorHandler = (): Observable<Event> => {
    return new Observable(observer => {
      this.websocket.onerror = (event: Event) => {
        observer.next(event);
      };
    });
  };

  public publish = (message: BaseMessage) => {
    try {
      let adjustedMessage: any = {};
      if (this.useSocketAWS === false) {
        adjustedMessage = message;
      } {
        adjustedMessage = {
          action: 'post',
          data: message
        };
      }
      this.websocket.send(JSON.stringify(adjustedMessage));
    } catch (error) {
      console.log(error);
    }
  };

}
