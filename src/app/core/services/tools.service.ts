import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor() { }

  generateUUID(): string {  
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, () => {  
        const r = Math.floor(Math.random() * 16);  
        return r.toString(16);  
    });  
  }

}
