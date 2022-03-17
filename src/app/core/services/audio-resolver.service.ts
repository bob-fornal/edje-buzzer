
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  audioFiles = [
    './assets/audio/dave--good-evening.mp3',
    './assets/audio/dave--i-cant-do-that.mp3',
    './assets/audio/dave--serve-no-purpose.mp3',
  ];
  audioConnections: Array<any> = [];

  constructor() {
    for (let i = 0, len = this.audioFiles.length; i < len; i++) {
      const audio = this.preloadAudio(this.audioFiles[i]);
      this.audioConnections.push(audio);
    }
  }

  play = (index: number) => {
    this.audioConnections[index].play();
  };

  preloadAudio = (url: string): any => {
    const audio = new Audio();
    audio.src = url;
    audio.preload = 'auto';
    return audio;
  }
}
