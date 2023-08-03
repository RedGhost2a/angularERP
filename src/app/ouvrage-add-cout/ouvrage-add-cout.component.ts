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
  coutOuvrage!: Cout;
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
    console.log("id de l'ouvrage courant",this.currentOuvrageId )
    this.coutChecked.forEach(cout => {
      console.log("valeur de cout", cout)
      this.ouvrageCout = {
        OuvrageId: this.initialData.id,
        CoutId: cout,
        ratio: 1,
        // uRatio: `${this.initialData.unite}`
      }
       this.ouvrageCoutService.create(this.ouvrageCout).subscribe()
    })

    // console.log(this.ouvrageCout)
    //
    // for (let val of this.coutChecked) {
    //   // console.log(val);
    //   // console.log('valeur')
    //   //this.ouvrageCoutService.addCoutOuvrage(val, this.ouvrageId).subscribe()
    //   console.log('OUVRAGE AJOUT COUT')
    //   this.coutService.getById(val).subscribe(data => {
    //     this.coutOuvrage = data;
    //     console.log("data", data)
    //     //console.log(typeof(data.Fournisseurs));
    //
    //     const {Fournisseurs}: any = data;
    //     const {TypeCout}: any = data;
    //     if (Fournisseurs[0].remarque === null) {
    //       Fournisseurs[0].remarque = "";
    //     }
    //     this.coutDuDevis = {
    //       OuvrageId: this.ouvrageId,
    //       type: TypeCout.type,
    //       categorie: TypeCout.categorie,
    //       designation: data.designation,
    //       unite: data.unite,
    //       prixUnitaire: data.prixUnitaire,
    //       fournisseur: Fournisseurs[0].commercialName,
    //       remarque: Fournisseurs[0].remarque
    //     }
    //
    //     this.coutService.createCoutDuDevis(this.coutDuDevis).subscribe()
//       })
// }
  }
  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
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
