import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Metre} from "../../_models/metre";
import {Ouvrage} from "../../_models/ouvrage";

export interface MetreStrategyInterface {
   formGroup:FormGroup;
  createFormBuilder(formBuilder: FormBuilder):void;
  dynamicInputs(formBuilder: FormBuilder): FormGroup;
  setValueInForm(index: number,metre: Metre):void;
  concatMetre(bool: boolean, i : number, resultCalculMetre:string, resultMetre:number[], longForm:FormControl,
              largForm?:FormControl, hautForm?:FormControl ):string;
  createOrUpdateMetre(ouvrage:Ouvrage, metreIdForm: FormControl,longForm:FormControl, largForm?:FormControl,
                      hautForm?:FormControl):void;
}
