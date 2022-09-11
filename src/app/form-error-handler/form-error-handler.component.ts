import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';

export interface ErrorMessage {
  validatorName: string;
  message: string;
}

@Component({
  selector: 'form-error-handler',
  templateUrl: './form-error-handler.component.html'
})
export class FormErrorHandlerComponent implements OnInit {
  /** Mandatory inputs */
  @Input('formCtrlName') formCtrlName: string;
  @Input('formGroup') formGroup?: FormGroup;

  /** Optionals inputs */
  @Input('formArrIndex') formArrIndex: number = null;
  @Input('formArrName') formArrName: string = null;
  @Input('messagesCountLimit') messagesCountLimit: number = 0;
  @Input('exclude') exclude: string | string[] = [];
  @Input('thisValidatorOnly') thisValidatorOnly?: string;
  @Input('customValidators') customValidators: ErrorMessage[] = [];
  @Input('debounceTime') debounceTime: number = 200;

  private formControl: AbstractControl;
  private capitalizedName: string;

  errorMessages$: Observable<ErrorMessage[]>;

  ngOnInit(): void {
    this.setFormControl();
    this.capitalizedName = this.formCtrlName ? this.formCtrlName[0].toUpperCase() + this.formCtrlName.slice(1) : '';
    this.errorMessages$ = this.setErrors();
  }

  setFormControl(): void {
    if (this.formArrName) {
      if (this.formArrIndex === null) {
        console.error('Input formArrName is defined but formArrIndex isn\'t !');
        return;
      }
      const formArray = this.formGroup.controls[this.formArrName] as FormArray;
      this.formControl = formArray.controls[this.formArrIndex].get(this.formCtrlName);
    } else {
      this.formControl = this.formGroup.controls[this.formCtrlName];
    }
  }

  setErrors(): Observable<any> {
    return this.formControl.valueChanges.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged(),
      map(_ => this.getErrors())
    );
  }

  getErrors(): ErrorMessage[] {
    let errorMessages: ErrorMessage[] = [
      {
        validatorName: 'required',
        message: `${this.capitalizedName} is required`
      },
      {
        validatorName: 'minlength',
        message: `${this.capitalizedName} must have at least
          ${this.formControl?.errors?.['minlength']?.['requiredLength']} characters
          (currently ${this.formControl?.errors?.['minlength']?.['actualLength']} characters)`
      },
      {
        validatorName: 'maxlength',
        message: `${this.capitalizedName} must have at most
          ${this.formControl?.errors?.['maxlength']?.['requiredLength']} characters 
          (currently ${this.formControl?.errors?.['maxlength']?.['actualLength']} characters)`
      },
      {
        validatorName: 'min',
        message: `${this.capitalizedName} must be greater than ${this.formControl?.errors?.['min']?.['min']}`
      },
      {
        validatorName: 'max',
        message: `${this.capitalizedName} must be greater than ${this.formControl?.errors?.['max']?.['max']}`
      },
      {
        validatorName: 'email',
        message: `Invalid email format`
      },
      {
        validatorName: 'pattern',
        message: `Invalid format (required pattern /${this.formControl?.errors?.['pattern']?.['requiredPattern']}/)`
      }
    ];

    // handle thisValidatorOnly
    if (this.thisValidatorOnly) {
      errorMessages = errorMessages.filter(err => err.validatorName.toLowerCase() === this.thisValidatorOnly.toLowerCase());
      this.customValidators = this.customValidators.filter(err => err.validatorName.toLowerCase() === this.thisValidatorOnly.toLowerCase());
    }

    // handle exclude
    if (this.exclude.length) {
      errorMessages = this.excludedValidatorsHandler(errorMessages);
      this.customValidators = this.excludedValidatorsHandler(this.customValidators);
    }

    // allow to overwrite a default message using customValidators
    const reducedErrorMessages = errorMessages.reduce((acc, curr) => {
      if (!acc.some(err => err.validatorName === curr.validatorName)) acc.push(curr);
      return acc;
    }, [...this.customValidators]);

    return this.formControl?.errors ? reducedErrorMessages.filter(err => this.formControl.errors.hasOwnProperty(err.validatorName)) : [];
  }

  excludedValidatorsHandler(errorArray: ErrorMessage[]): ErrorMessage[] {
    return errorArray.filter(err => {
      if (Array.isArray(this.exclude)) {
        return !this.exclude.map(v => v.toLowerCase()).includes(err.validatorName.toLowerCase());
      }
      return this.exclude.toLowerCase() !== err.validatorName.toLowerCase();
    });
  }

}