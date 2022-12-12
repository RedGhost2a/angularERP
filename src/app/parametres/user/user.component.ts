import {Component, OnInit} from '@angular/core';
import {UserService} from "../../_service/user.service";
import {User} from "../../_models/users";
import {DevisService} from 'src/app/_service/devis.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: User;
  devis!: any;


  constructor(private accountService: UserService, private devisService: DevisService) {
    this.user = this.accountService.userValue;

  }

  ngOnInit(): void {
    this.getDevisByUser(this.user.id)

  }

  getDevisByUser(id: any): void {
    // @ts-ignore
    this.devis = this.devisService.getDevisByUser(id).subscribe(data => {
      this.devis = data
      console.log(this.devis)
      return this.devis;

    });
  }

}
