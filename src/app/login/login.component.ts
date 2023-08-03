import {Component, Inject, OnInit} from '@angular/core';
import {first} from "rxjs";
import {UserService} from "../_service/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../_service/alert.service";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  public checkbox !: boolean;
  erorr!: "";

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public accountService: UserService,
    private alertService: AlertService,
    @Inject(TOASTR_TOKEN) private toastr: Toastr
  ) {
  }

  success(message: string): void {
    this.toastr.success(message, "Connexion reussie");
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention");
  }

  ngOnInit() {
    console.log("toastr",this.toastr)
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }


  onSubmit() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.form.invalid) {
      this.warning("Erreur!")
      return
    } else {
      this.loading = true;
      this.accountService.login(this.f['email'].value, this.f['password'].value)
        .pipe(first())
        .subscribe(
          data => {
            // console.log(data.role)
            this.success("Connecté !")
            // if (data.role === "Super Admin") {
              this.router.navigate(['/dashboard']);
            // } else
            //   this.router.navigate([this.returnUrl]);
          },
          error => {
            this.warning("Mot de passe et ou email inconnu !")
            this.erorr = error
            this.alertService.error(error);
            this.loading = false;
          });
    }
  }
}
