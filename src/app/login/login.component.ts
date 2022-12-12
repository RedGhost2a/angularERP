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
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  toggleEditable(event: any) {
    if (event.target.checked) {
      this.checkbox = true;
    }
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      this.warning("Erreur!")

      return;
    }
      // if (this.checkbox) {
      //   this.loading = true;
      //   this.superAdminService.login(this.f['email'].value, this.f['password'].value)
      //     .pipe(first())
      //     .subscribe(
      //       data => {
      //         console.log(data)
      //         this.success("Connecté !")
      //
      //         // this.accountService.getRole()
      //         this.router.navigate(["/admin"]);
      //       },
      //       error => {
      //         this.warning("Mot de passe et ou email inconnue !")
      //         this.alertService.error(error);
      //         this.erorr = error
      //         this.loading = false;
      //       });
    // }
    else {
      this.loading = true;
      this.accountService.login(this.f['email'].value, this.f['password'].value)
        .pipe(first())
        .subscribe(
          data => {
            console.log(data.role)
            this.success("Connecté !")
            // this.accountService.getRole()
            if (data.role === "Super Admin") {
              this.router.navigate(['/admin']);

            } else
              this.router.navigate([this.returnUrl]);
          },
          error => {
            this.warning("Mot de passe et ou email inconnue !")
            this.erorr = error
            this.alertService.error(error);
            this.loading = false;
          });


    }


  }
}
