import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Notes} from "../_models/notes";
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private router: Router,
              private http: HttpClient,) {
  }

  create(note: Notes): Observable<any> {
    return this.http.post<Notes>(`${environment.apiUrl}/notes/new`, note)
  }

  getNoteByUser(id: any): Observable<any> {
    return this.http.get<Notes>(`${environment.apiUrl}/notes/${id}`)
  }

  getNoteById(id: any): Observable<any> {
    return this.http.get<Notes>(`${environment.apiUrl}/notes/note/${id}`)
  }


  getAllNote(): Observable<any> {
    return this.http.get<Notes>(`${environment.apiUrl}/notes`,)
  }

  delete(id: any): Observable<any> {
    return this.http.delete<Notes>(`${environment.apiUrl}/notes/${id}`,)
  }

  updateNoteResolution(note: Notes): Observable<any> {
    return this.http.put(`${environment.apiUrl}/notes/${note.id}`, note);
  }


}
