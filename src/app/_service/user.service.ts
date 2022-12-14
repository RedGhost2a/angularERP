import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {User} from "../_models/users";
import {BehaviorSubject, map, Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject!: BehaviorSubject<User>;
  public user !: Observable<User>;
  role !: any


  constructor(private router: Router,
              private http: HttpClient,
  ) {

    // @ts-ignore
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')))
    this.user = this.userSubject.asObservable();

  }


  public get userValue(): User {
    return this.userSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<User>(`http://localhost:4000/users/authenticate`, {email, password})
      .pipe(map(user => {

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  logout() {
    console.log("logout")
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null!);
    this.router.navigate(['/home']);
  }

  register(user: User): Observable<any> {
    return this.http.post('http://localhost:4000/users/new', user);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get('http://localhost:4000/users/current')
  }

  getAll(): Observable<any> {
    return this.http.get(`http://localhost:4000/users`)

  }

  update(user: User, id: any): Observable<any> {
    return this.http.put(`http://localhost:4000/users/${id}`, user)
  }

  getById(id: any): Observable<any> {
    return this.http.get(`http://localhost:4000/users/${id}`)
  }

  deleteByID(id: any): Observable<any> {
    return this.http.delete(`http://localhost:4000/users/${id}`)
  }

  getRoles(id: any): Observable<any> {
    return this.http.get(`http://localhost:4000/users/${id}`).pipe(
      map((response: any) => {
        return response.roles;
      })
    );
  }

}
