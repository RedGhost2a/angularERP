import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  apiUrl = 'http://localhost:4000/logs';

  constructor(private http: HttpClient) {
  }

  getLogs() {
    return this.http.get(`http://localhost:4000/logs`);
  }
}
