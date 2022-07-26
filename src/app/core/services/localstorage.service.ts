
import { Injectable } from '@angular/core';

import config from '@core/constants/config.json';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {


  constructor() { }

  setKey = (key: string): void => {
    const readKey: string = config.key;
    localStorage.setItem(readKey, key);
  };

  getKey = (): string | null => {
    const readKey: string = config.key;
    return localStorage.getItem(readKey);
  };

}
