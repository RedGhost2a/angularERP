import {Component, Inject, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Cout} from "../_models/cout";
import {CoutService} from "../_service/cout.service";
import {OuvrageService} from "../_service/ouvrage.service";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {CoutDuDevis} from "../_models/cout-du-devis";
import {UserService} from "../_service/user.service";
import {User} from "../_models/users";
import {OuvrageCout} from "../_models/ouvrageCout";
import {Ouvrage} from "../_models/ouvrage";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-ouvrage-add-cout',
  templateUrl: './ouvrage-add-cout.component.html',
  styleUrls: ['./ouvrage-add-cout.component.scss']
})
export class OuvrageAddCoutComponent implements OnInit {


  @Input() listCout!: Cout[]
  coutChecked: number[] = [];
  ouvrageId!: number
  columnsToDisplay = ["checkBox", "type", "categorie", "designation", "unite", "prixUnitaire", "fournisseur",
    // "remarque"
  ];
  coutDuDevis!: CoutDuDevis;
  currentUser!:User;
  currentOuvrageId!:number;
  ouvrageCout !: OuvrageCout ;
  initialData!: Ouvrage;
  dataSource!: any;



  constructor(private route: ActivatedRoute, private coutService: CoutService,
              private ouvrageService: OuvrageService, private ouvrageCoutService: OuvrageCoutService,
              private userService : UserService,@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<DialogComponent>,) {

    this.initialData = this.data;
  }


  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      this.currentOuvrageId = +params['id']
    })
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(data =>{
      this.getAll(data.Entreprises[0].id)
    })
  }

  getAll(entrepriseId: number): void {
    this.coutService.getAll(entrepriseId).subscribe(data => {
      this.listCout = data
      this.dataSource = new MatTableDataSource(data);
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.trim().toLowerCase();
      const type = data.TypeCout.type.toLowerCase();
      const designation = data.designation.toLowerCase();
      const categories = data.TypeCout.categorie.toLowerCase();
      const valuesToSearch = [type, designation, categories];
      return valuesToSearch.some(value => value.includes(searchText));
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addCoutOuvrage() {
    this.coutChecked.forEach(cout => {
      this.ouvrageCout = {
        OuvrageId: this.initialData.id,
        CoutId: cout,
        ratio: 1,
      }
       this.ouvrageCoutService.create(this.ouvrageCout).subscribe()
    })
  }
  closeDialog() {
    this.dialogRef.close();
  }

  onCheck(idCout: number): void {
    if (this.coutChecked.indexOf(idCout) !== -1) {
      this.coutChecked.forEach((element, index) => {
        if (element == idCout) this.coutChecked.splice(index, 1);
      });
    } else {
      this.coutChecked.push(idCout)
    }
    console.log(this.coutChecked);
  }


}
