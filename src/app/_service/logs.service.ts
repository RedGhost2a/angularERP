import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Log} from "../_models/log";
import {BehaviorSubject, map, Observable} from "rxjs";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  apiUrl = `${environment.apiUrl}/logs`;
  public logs$!: Observable<Log[]>;
  private logsSubject: BehaviorSubject<Log[]> = new BehaviorSubject<Log[]>([]);

  constructor(private http: HttpClient) {
    this.logs$ = this.logsSubject.asObservable()
  }

  AllLogs: any;


  getLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(`${environment.apiUrl}/logs/`).pipe(
      map(data => {
        this.AllLogs = data;
        this.logsSubject.next(data)
        // console.log(this.logs$)
        return data;
      })
    );
  };


}
