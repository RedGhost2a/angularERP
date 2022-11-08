import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../_service/user.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  @Input() updateUser!: UserEditComponent
  public myFormGroup: FormGroup;
  textButton!: string;


  constructor(private userService: UserService, private formBuilder: FormBuilder,
              private route: ActivatedRoute, private router: Router) {

    this.myFormGroup = this.formBuilder.group({
      email: "",
      password: "",
      title: "",
      firstName: "",
      lastName: "",
      role: "",
    })

  }


  createAndUpdate(): void {

    this.route.params.subscribe(params => {
      const userID = +params['id']
      console.log(userID)
      if (isNaN(userID)) {
        this.userService.register(this.myFormGroup.getRawValue()).subscribe(
          (): void => {

            if (this.myFormGroup.status === 'VALID') this.router.navigate(['/users']);

          }
        )
      } else {
        this.userService.update(this.myFormGroup.getRawValue(), String(userID))
          .subscribe((): void => {

            alert('Update!');
            if (this.myFormGroup.status === 'VALID') this.router.navigate(['/users']);

          });
      }
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userID = +params['id']
      if (!isNaN(userID)) {
        this.textButton = 'Modifier le client'
        this.userService.getById(userID).subscribe(data => {
          // Assuming res has a structure like:
          data = {
            email: data.email,
            password: data.password,
            title: data.title,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
          }

          this.myFormGroup.patchValue(data);
        });
      } else {
        this.textButton = 'Creer un nouveau utilisateur'
        this.formBuilder.group({
          title: [],
          firstName: [],
          lastName: [],
          role: [],
          email: [],
          password: [],
        });


      }
    })
  }

}
