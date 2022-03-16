
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AudioResolverService implements Resolve<Promise<Array<string>>> {

  audioFiles = [
    './assets/audio/dave--good-evening.mp3',
    './assets/audio/dave--i-cant-do-that.mp3',
    './assets/audio/dave--serve-no-purpose.mp3',
  ];

  constructor() { }

  resolve = (): Promise<Array<string>> => Promise.all(this.audioFiles.map(this.preloadAudio));

  preloadAudio = (url: string): Promise<string> => {
    const audio = new Audio();
    audio.src = url;
    return new Promise((resolve, reject) => audio.addEventListener('canplaythrough', () => resolve(url), false));
  }
}
