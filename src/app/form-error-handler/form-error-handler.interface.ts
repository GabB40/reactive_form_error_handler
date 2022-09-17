import { FormGroup } from "@angular/forms";
import { PatternMessages } from './regex';


export interface ErrorMessage {
  validatorName: string;
  message: string;
}

export interface FormErrorhandlerConfig {
  formGroup: FormGroup;
  messagesCountLimit?: number;
  exclude?: string | string[];
  thisValidatorOnly?: string;
  customValidators?: ErrorMessage[];
  patternMessages?: PatternMessages[];
  debounceTime?: number;
}