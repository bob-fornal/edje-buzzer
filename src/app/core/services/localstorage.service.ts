
import { Injectable } from '@angular/core';

import config from '@core/constants/config.json';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  get = (key: string): any => localStorage.getItem(key);
  set = (key: string, value: string): any => localStorage.setItem(key, value);

  setWebsocketKey = (key: string): void => {
    const readKey: string = config.key;
    localStorage.setItem(readKey, key);
  };

  getWebsocketKey = (): string | null => {
    const readKey: string = config.key;
    return localStorage.getItem(readKey);
  };

}
