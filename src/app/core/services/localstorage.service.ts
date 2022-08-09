
import { Injectable } from '@angular/core';

import config from '@core/constants/config.json';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  localstorage: any = localStorage;

  get = (key: string): any => this.localstorage.getItem(key);
  set = (key: string, value: string): any => this.localstorage.setItem(key, value);

  setWebsocketKey = (key: string): void => {
    const readKey: string = config.key;
    this.localstorage.setItem(readKey, key);
  };

  getWebsocketKey = (): string | null => {
    const readKey: string = config.key;
    return this.localstorage.getItem(readKey);
  };

}
