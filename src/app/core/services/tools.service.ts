
import { Injectable } from '@angular/core';

import { LocalstorageService } from './localstorage.service';

import config from '@core/constants/config.json';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor(
    public storage: LocalstorageService
  ) { }

  generateUUID(): string {
    const uuidKey: string = config.uuid;
    const oldUUID: any = this.storage.get(uuidKey);
    if (oldUUID !== null) return oldUUID;

    const newUUID: string = 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, () => {  
      const r = Math.floor(Math.random() * 16);  
      return r.toString(16);  
    });
    this.storage.set(uuidKey, newUUID);
    return newUUID;
  }

}
