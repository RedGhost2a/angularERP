import {ComponentFixture, TestBed, tick} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {UserService} from "../_service/user.service";
import {HttpClient, HttpHandler} from '@angular/common/http';
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {of, throwError} from "rxjs";
import {User} from "../_models/users";
import {DebugElement, InjectionToken} from "@angular/core";
import jasmine from "jasmine";


class MockToastr implements Toastr {
  success(message: string, title: string) {
  }

  info() {
  }

  warning() {
  }

  error() {
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let userService: UserService
  let spyWarning: jasmine.Spy
  let spySucess: jasmine.Spy
  let spyNavigate: jasmine.Spy
  let user: User
  let buttonValider: DebugElement

  function setValueInForm(email: string, password: string) {
    component.form.controls['email'].setValue(email);
    component.form.controls['password'].setValue(password);

  }


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [LoginComponent],
      providers: [
        FormBuilder, UserService, HttpClient, HttpHandler,
        {provide: TOASTR_TOKEN, useClass: MockToastr}
      ]
    })
    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router)
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    spyWarning = spyOn(component, 'warning')
    spySucess = spyOn(component, 'success')
    spyNavigate = spyOn(router, 'navigate')
    user = new User()
    fixture.detectChanges();
    buttonValider = fixture.debugElement


  });

  it('should create', () => {
    const http = TestBed.inject(HttpClient);
    expect(component).toBeTruthy();
  });


  fit('should warning and not rederect if user doesn t exists', () => {
    user.email = "aubrii@hotmail.fr"
    user.password = "passwords"
    user.role = "Super Admin"
    setValueInForm(user.email, user.password)


    console.log(component.form)
    expect(component.form.valid).toBeTruthy()
    spyOn(userService, 'login').and.returnValue(throwError({error: "Username or password is incorrect"}));
    component.onSubmit();
    expect(spyWarning).toHaveBeenCalled()
    expect(spyNavigate).not.toHaveBeenCalled();


  });
  fit('should redirect to home if user Super Admin exists', () => {
    user.email = "aubrii@hotmail.fr"
    user.password = "passwords"
    user.role = "Super Admin"
    setValueInForm(user.email, user.password)

    expect(component.form.valid).toBeTruthy()

    spyOn(userService, 'login').and.returnValue(of(user));
    component.onSubmit();
    expect(spySucess).toHaveBeenCalled()
    expect(spyNavigate).toHaveBeenCalledWith(['/admin']);


  });
  fit('should redirect to home if user Admin exists', () => {
    user.email = "aubrii@hotmail.fr"
    user.password = "passwords"
    user.role = "Admin"
    setValueInForm(user.email, user.password)

    expect(component.form.valid).toBeTruthy()

    spyOn(userService, 'login').and.returnValue(of(user));
    component.onSubmit();
    expect(spySucess).toHaveBeenCalled()
    expect(spyNavigate).toHaveBeenCalledWith(['/']);


  });

  fit('should waring if form isInvalid and button disabled', () => {
    user.email = "aubriihotmail.fr"
    user.password = "password"
    user.role = "Super Admin"
    setValueInForm(user.email, user.password)
    fixture.detectChanges()


    expect(component.form.invalid).toBeTruthy()
    expect(buttonValider.nativeElement.querySelector('button').disabled).toBeTruthy()
    spyOn(userService, 'login').and.returnValue(throwError({error: "Username or password is incorrect"}));
    component.onSubmit();
    expect(spyWarning).toHaveBeenCalled()
    expect(spyNavigate).not.toHaveBeenCalled();
  });
});
