import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Metre} from "../../_models/metre";
import {Ouvrage} from "../../_models/ouvrage";

export interface MetreStrategyInterface {
  createFormBuilder(formBuilder: FormBuilder): FormGroup;
  dynamicInputs(formBuilder: FormBuilder): FormGroup;
  setValueInForm(formGroup:FormGroup, metre: Metre):void;
  concatMetre(bool: boolean, i : number,resultCalculMetre:string,resultMetre:number[], longueurFormControl:FormControl, largeurFormControl?:FormControl, hauteurFormControl?:FormControl ):string;
  createOrUpdateMetre(ouvrageDuDevis:Ouvrage, metreIdFormControl: FormControl,longueurFormControl:FormControl, largeurFormControl?:FormControl, hauteurFormControl?:FormControl):void;
}
