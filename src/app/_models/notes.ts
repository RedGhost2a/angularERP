import {Log} from "./log";

export class Notes {
  id!: number;
  title!: string;
  text!: string;
  typeError!: string;
  optionsTypeError!: string;
  createdAt!: Date;
  optionsTimestamp!: Date;
  errorLogs!: Log[];
  resolution!: boolean;
  userId!: number;

}



