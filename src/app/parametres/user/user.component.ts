import {Component, OnInit} from '@angular/core';
import {UserService} from "../../_service/user.service";
import {User} from "../../_models/users";
import {DevisService} from 'src/app/_service/devis.service';
import {Notes} from "../../_models/notes";
import {NotesService} from "../../_service/notes.service";
import {EntrepriseService} from "../../_service/entreprise.service";
import {Entreprise} from "../../_models/entreprise";
import {DialogConfirmSuppComponent} from "../../dialog-confirm-supp/dialog-confirm-supp.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user!: User;
  devis!: any;
  notes!: Notes[];
  userEntreprise!: Entreprise[];
  curentUser !: any;


  constructor(private accountService: UserService,
              private devisService: DevisService,
              private notesService: NotesService,
              private entrepriseService: EntrepriseService,
              private dialog: MatDialog) {


  }

  ngOnInit() {
    this.user = this.accountService.userValue;
    // console.log(this.user)
    this.getCurrentUser()
    this.getDevisByUser(this.user.id)
    this.getNoteByUser(this.user.id)
    // this.getEntreprise()

  }

  getCurrentUser(): any {
    const currentUser = this.user.id;
    this.accountService.getById(currentUser).subscribe(value => {
      this.curentUser = value;
      const entreprises: Entreprise[] = []; // tableau pour stocker les entreprises
      for (let i = 0; i < this.curentUser.Entreprises.length; i++) {
        this.entrepriseService.getById(this.curentUser.Entreprises[i].UserEntreprise.EntrepriseId).subscribe(data => {
          entreprises.push(data); // ajouter chaque entreprise récupérée à la fin du tableau
          if (entreprises.length === this.curentUser.Entreprises.length) {
            this.userEntreprise = entreprises; // affecter le tableau à la variable une fois toutes les entreprises récupérées
          }
        });
      }
    });
  }


  getDevisByUser(id: any): void {
    this.devis = this.devisService.getDevisByUser(id).subscribe(data => {
      this.devis = data.Devis
      console.log(this.devis)

    });
  }

  getNoteByUser(id: any): void {
    this.notesService.getNoteByUser(id).subscribe(data => {
      this.notes = data
      // console.log(this.notes)

    });
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Appeler la fonction de suppression ici
        this.notesService.delete(id).subscribe(() => this.ngOnInit());
      }
    });
  }


  getColor(note: Notes) {
    switch (note.typeError) {
      case "J'ai une demande / suggestion !":
        return '#2196F3';
      case "Je souhaite créer une note !":
        return '#FFC107';
      case "J'ai rencontré une erreur !":
        return 'rgb(245 114 114)';
      case 'Autres':
        return '#9E9E9E';
      default:
        return 'white';
    }
  }

}
