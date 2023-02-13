import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Notes} from "../_models/notes";


@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private router: Router,
              private http: HttpClient,) {
  }

  create(note: Notes): Observable<any> {
    return this.http.post<Notes>('http://localhost:4000/notes/new', note)
  }

  getNoteByUser(id: any): Observable<any> {
    return this.http.get<Notes>(`http://localhost:4000/notes/${id}`,)
  }

  delete(id: any): Observable<any> {
    return this.http.delete<Notes>(`http://localhost:4000/notes/${id}`,)
  }

}
