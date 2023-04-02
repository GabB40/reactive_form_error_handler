import { EventEmitter, Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormErrorhandlerConfig } from './form-error-handler.interface';

@Injectable({
  providedIn: 'root'
})
export class FormErrorHandlerService {

  private config: FormErrorhandlerConfig = {
    formGroup: null,
    messagesCountLimit: 0,
    exclude: [],
    thisValidatorOnly: null,
    customValidators: [],
    patternMessages: [],
    debounceTime: 300,
  };

  getConfig(): FormErrorhandlerConfig {
    return this.config;
  }

  /**
   * @param config
   */
  setConfig(config: FormErrorhandlerConfig): void {
    this.config = { ...this.config, ...config };
  }

  emitValueChanges(formGroup: FormGroup) {
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl>formGroup.controls[key];
        if (Object.keys(control).includes('controls')) {
          const formGroupChild: FormGroup = <FormGroup>formGroup.controls[key];
          this.emitValueChanges(formGroupChild);
        }
        (<EventEmitter<any>>control.valueChanges).emit(control.value);
      }
    }
  }

}
