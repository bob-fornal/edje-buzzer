
import { TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';

import { BaseMessage } from '@core/interfaces/base-message';

class MockWebSocket {
  url: string = '';

  constructor(url: string) {
    if (url !== 'URL') throw 'ERROR';
    this.url = url;
  }
}

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('expects "setApiKey" to take the key and connect', () => {
    const key: string = 'KEY';
    spyOn(service, 'connectWebSocket').and.stub();

    service.setApiKey(key);
    expect(service.PIE_API_KEY).toEqual(key);
    expect(service.connectWebSocket).toHaveBeenCalled();
  });

  it('expects "getPieSocketUrl" to produce the correct wss url', () => {
    const cluster: string = 'CLUSTER';
    const channel: string = 'CHANNEL';
    const apikey: string = 'API-KEY';
    const expected: string = 'wss://CLUSTER.piesocket.com/v3/CHANNEL?api_key=API-KEY&notify_self';

    const result: string = service.getPieSocketUrl(cluster, channel, apikey);
    expect(result).toEqual(expected);
  });

  it('expects "connectWebSocket" to connect', () => {
    spyOn(service, 'getPieSocketUrl').and.returnValue('URL');
    
    service.connectWebSocket(MockWebSocket);
    expect(service.websocket.url).toEqual('URL');
  });

  it('expects "connectWebSocket" to handle error', () => {
    spyOn(service, 'getPieSocketUrl').and.returnValue('HANDLE-ERROR');
    
    service.connectWebSocket(MockWebSocket);
    expect(console.log).toHaveBeenCalledWith('ERROR');
  });

  it('expects "messageOfType" to allow subscription and handle a message of type any', () => {
    let result: any;
    service.websocket = {};
    service.messagesOfType('~~ANY~~').subscribe((data: any) => {
      result = data;
    });
    const item: any = { data: { type: '~~ANY~~', payload: 'PAYLOAD' } };
    const message: any = { data: JSON.stringify(item) };

    service.websocket.onmessage(message);
    expect(result).toEqual(item.data);
  });

  it('expects "messageOfType" to allow subscription and handle a specific message type', () => {
    let result: any;
    service.websocket = {};
    service.messagesOfType('SPECIFIC').subscribe((data: any) => {
      result = data;
    });
    const item: any = { data: { type: 'SPECIFIC', payload: 'PAYLOAD' } };
    const message: any = { data: JSON.stringify(item) };

    service.websocket.onmessage(message);
    expect(result).toEqual(item.data);
  });

  it('expects "messageOfType" to allow subscription and handle a different message type', () => {
    let result: any;
    service.websocket = {};
    service.messagesOfType('DIFFERENT').subscribe((data: any) => {
      result = data;
    });
    const item: any = { data: { type: 'SPECIFIC', payload: 'PAYLOAD' } };
    const message: any = { data: JSON.stringify(item) };

    service.websocket.onmessage(message);
    expect(result).toBeUndefined();
  });

  it('expects "errorHandler" to allow subscription and pass any errors', () => {
    let result: any;
    service.websocket = {};
    service.errorHandler().subscribe((data: any) => {
      result = data;
    });
    const event: Event = new Event('ERROR');

    service.websocket.onerror(event);
    expect(result).toEqual(event);
  });

  it('expects "publish" to take a message and send it correctly', () => {
    const message: BaseMessage = { type: 'TYPE', payload: 'PAYLOAD' };
    const expected: string = JSON.stringify(message);
    service.websocket = {
      send: () => ({})
    };
    spyOn(service.websocket, 'send').and.stub();

    service.publish(message);
    expect(service.websocket.send).toHaveBeenCalledWith(expected);
  });

  it('expects "publish" to take a message and handle an error', () => {
    const message: BaseMessage = { type: 'TYPE', payload: 'PAYLOAD' };
    const expected: string = JSON.stringify(message);
    service.websocket = {
      send: () => ({})
    };
    spyOn(service.websocket, 'send').and.throwError('ERROR');

    service.publish(message);
    expect(console.log).toHaveBeenCalled();
  });

});
