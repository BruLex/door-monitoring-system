import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {merge,  of as observableOf, Observable} from "rxjs";
import {mergeMap} from "rxjs/operators";

enum Statuses {
  Success = 'success',
  Error = 'error'
}

class Response {
  status: Statuses;
  data?: any;
  message?: string;
  constructor(data: object) {
    Object.keys(data).forEach(key => this[key] = data[key]);
  }
  get isSuccess() { return this.status === Statuses.Success; }
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private title: string = '';

  constructor(private http: HttpClient) {
  }

  setAppConfig(config: { title: string}) {
    this.title = config.title;
  }

  getConfig() {
    return {
      title: this.title
    };
  }



  apiRequest(service: string, method: string, body: object = {}): Observable<Response> {
    return this.http.post<Response>(`http://127.0.0.1:3000/api/${service}/${method}`, body)
      .pipe(mergeMap( resp => observableOf(new Response(resp))));
  }
}
