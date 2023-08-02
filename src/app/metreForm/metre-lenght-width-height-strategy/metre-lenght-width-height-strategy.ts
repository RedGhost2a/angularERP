import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Metre} from "../../_models/metre";
import {MetreStrategyInterface} from "../metre-strategy-interface/metre-strategy.interface";
import {Ouvrage} from "../../_models/ouvrage";
import {MetreService} from "../../_service/metre.service";

export class MetreLenghtWidthHeightStrategy implements MetreStrategyInterface {
  constructor(private metreService : MetreService) {
  }
  createFormBuilder(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      metres: formBuilder.array([
        this.dynamicInputs(formBuilder)
      ])
    })
  }

  dynamicInputs(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      longueur: new FormControl("L", Validators.required),
      largeur: new FormControl("L", Validators.required),
      hauteur: new FormControl("H", Validators.required),
      metreId: new FormControl("")
    })
  }

  setValueInForm(formGroup: FormGroup, metre: Metre): void {
    formGroup.controls['longueur'].setValue(metre.longueur)
    formGroup.controls['largeur'].setValue(metre.largeur)
    formGroup.controls['hauteur'].setValue(metre.hauteur)
    formGroup.controls['metreId'].setValue(metre.id)
  }

  concatMetre(bool: boolean, i: number, resultCalculMetre: string, resultMetre: number[], longueurFormControl: FormControl, largeurFormControl: FormControl, hauteurFormControl: FormControl): string {
    const result = parseFloat(longueurFormControl.value) * parseFloat(largeurFormControl.value) * parseFloat(hauteurFormControl.value);
    resultMetre[i] = result;
    const calculString = `(${longueurFormControl.value} x ${largeurFormControl.value} x ${hauteurFormControl.value})`;

    if (!bool) resultCalculMetre = calculString;
      else resultCalculMetre += ` + ${calculString}`;
    return resultCalculMetre;

  }

  createOrUpdateMetre(ouvrageDuDevis:Ouvrage, metreIdFormControl: FormControl,longueurFormControl:FormControl, largeurFormControl:FormControl, hauteurFormControl:FormControl):void{
    const metrePush: Metre = {
      id: metreIdFormControl.value === '' ? 0 : metreIdFormControl.value,
      longueur: longueurFormControl.value,
      largeur: largeurFormControl.value,
      hauteur: hauteurFormControl.value,
      OuvrageDuDeviId: ouvrageDuDevis.id
    };

    if (metreIdFormControl.value === '') this.metreService.createMetre(metrePush).subscribe();
    else this.metreService.updateMetre(metrePush, metrePush.id).subscribe();
  }


}
