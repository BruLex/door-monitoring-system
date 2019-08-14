import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private title: string = '';

  constructor() {
  }

  setAppConfig(config: { title: string}) {
    this.title = config.title;
  }

  getConfig() {
    return {
      title: this.title
    };
  }
}
