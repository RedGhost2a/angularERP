import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as XLSX from "xlsx";
import {ImportExcelService} from "../_service/importExcel.service";
import {MatDialogRef} from "@angular/material/dialog";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";

@Component({
  selector: 'app-dialog-import-excel',
  templateUrl: './dialog-import-excel.component.html',
  styleUrls: ['./dialog-import-excel.component.scss']
})
export class DialogImportExcelComponent implements OnInit {
  importForm!: FormGroup;

  constructor(
    private importExcelService: ImportExcelService,
    public dialogRef: MatDialogRef<DialogImportExcelComponent>,
    @Inject(TOASTR_TOKEN) private toastr: Toastr,
  ) {
    this.importForm = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  onFileSelected(): void {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      const files = (fileInput as HTMLInputElement).files;
      if (files && files.length === 1) {
        const file = files[0];
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          // Récupérer le contenu du fichier sous forme de chaîne binaire
          const bstr: string = e.target.result;

          // Lire le fichier Excel à l'aide de la bibliothèque XLSX
          const workbook: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

          // Récupérer le nom de la première feuille de calcul
          const worksheetName: string = workbook.SheetNames[0];
          console.log(worksheetName)
          // Récupérer la première feuille de calcul
          const worksheet: XLSX.WorkSheet = workbook.Sheets[worksheetName];
          // Convertir les données de la feuille de calcul en tableau de tableaux (matrice)
          // avec la première ligne contenant les en-têtes de colonnes
          const data: any[][] = XLSX.utils.sheet_to_json(worksheet, {header: 1});

          // Envoyer le fichier au service d'importation
          const title = this.importForm.get('title')?.value;
          console.log(title)
          const formData = {title: title, data: data};
          // formData.append('title', this.importForm.get('title')?.value);
          // formData.append('data', file);
          this.importExcelService.create(formData).subscribe(() => {
            this.toastr.success("Upload réussie", "Les données sont enregister")
            this.dialogRef.close()
          });
        };
        reader.readAsBinaryString(file);
      }
    }
  }


  ngOnInit(): void {
  }

}
