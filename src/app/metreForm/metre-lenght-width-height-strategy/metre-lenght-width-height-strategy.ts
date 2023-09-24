import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Metre} from "../../_models/metre";
import {MetreStrategyInterface} from "../metre-strategy-interface/metre-strategy.interface";
import {Ouvrage} from "../../_models/ouvrage";
import {MetreService} from "../../_service/metre.service";

export class MetreLenghtWidthHeightStrategy implements MetreStrategyInterface {
    formGroup!: FormGroup

  constructor(private metreService: MetreService) {
  }

  createFormBuilder(formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      metres: formBuilder.array([
        this.dynamicInputs(formBuilder)
      ])
    })
  }

  dynamicInputs(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      longueur: new FormControl("L", Validators.required),
      largeur: new FormControl("l", Validators.required),
      hauteur: new FormControl("H", Validators.required),
      metreId: new FormControl("")
    })
  }

  setValueInForm(index: number, metre: Metre): void {
    const metresArray = this.formGroup.get('metres') as FormArray;
    let formGroupArray = metresArray.controls[index] as FormGroup
    formGroupArray.controls['longueur'].setValue(metre.longueur)
    formGroupArray.controls['largeur'].setValue(metre.largeur)
    formGroupArray.controls['hauteur'].setValue(metre.hauteur)
    formGroupArray.controls['metreId'].setValue(metre.id)
  }

  concatMetre(bool: boolean, i: number, resultCalculMetre: string,
              resultMetre: number[], longForm: FormControl,
              largForm: FormControl, hautForm: FormControl): string {

    const result = parseFloat(longForm.value)
                  * parseFloat(largForm.value)
                  * parseFloat(hautForm.value);
    resultMetre[i] = result;
    const calculString = `(${longForm.value}
                        x ${largForm.value}
                        x ${hautForm.value})`;

    if (!bool) resultCalculMetre = calculString;
    else resultCalculMetre += ` + ${calculString}`;
    return resultCalculMetre;

  }

  createOrUpdateMetre(ouvrage: Ouvrage, metreIdForm: FormControl, longForm: FormControl, largForm: FormControl, hautForm: FormControl): void {
    const metrePush: Metre = {
      id: metreIdForm.value === '' ? 0 : metreIdForm.value,
      longueur: longForm.value,
      largeur: largForm.value,
      hauteur: hautForm.value,
      OuvrageDuDeviId: ouvrage.id
    };
    if (metreIdForm.value === '') this.metreService.createMetre(metrePush).subscribe((res: any) => {
      metreIdForm.setValue(res.metre.id)
    });
    else this.metreService.updateMetre(metrePush, metrePush.id).subscribe();
  }
}
