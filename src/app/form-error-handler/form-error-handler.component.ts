import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { ErrorMessage, FormErrorhandlerConfig } from './form-error-handler.interface';
import { FormErrorHandlerService } from './form-error-handler.service';
import { PatternMessages, Regex } from './regex';



@Component({
  selector: 'form-error-handler',
  templateUrl: './form-error-handler.component.html'
})
export class FormErrorHandlerComponent implements OnInit {
  /** Mandatory inputs */
  @Input() formCtrlName: string;

  /** Optionals inputs */
  @Input() label: string = null;
  @Input() formArrIndex: number = null;
  @Input() formArrName: string = null;
  @Input() messagesCountLimit?: number;
  @Input() exclude?: string | string[];
  @Input() thisValidatorOnly?: string;
  @Input() debounceTime?: number;
  @Input() patternMessages?: PatternMessages[];

  private config!: FormErrorhandlerConfig;
  private formControl: AbstractControl;

  errorMessages$: Observable<ErrorMessage[]>;

  constructor(private formErrorHandlerService: FormErrorHandlerService) { }

  ngOnInit(): void {
    this.setConfig();
    this.setFormControl();
    this.label = this.label ?? this.formCtrlName[0].toUpperCase() + this.formCtrlName.slice(1);
    this.errorMessages$ = this.setErrors();
  }

  setConfig() {
    this.config = this.formErrorHandlerService.getConfig();
    this.messagesCountLimit = this.messagesCountLimit ?? this.config.messagesCountLimit;
    this.exclude = this.exclude ?? this.config.exclude;
    this.thisValidatorOnly = this.thisValidatorOnly ?? this.config.thisValidatorOnly;
    this.debounceTime = this.debounceTime ?? this.config.debounceTime;
    this.patternMessages = this.patternMessages ?? this.config.patternMessages;
  }

  setFormControl(): void {
    if (this.formArrName) {
      if (this.formArrIndex === null) {
        console.error('Input formArrName is defined but formArrIndex isn\'t !');
        return;
      }
      const formArray = this.config.formGroup.controls[this.formArrName] as FormArray;
      this.formControl = formArray.controls[this.formArrIndex].get(this.formCtrlName);
    } else {
      this.formControl = this.config.formGroup.controls[this.formCtrlName];
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
        message: `${this.label} is required`
      },
      {
        validatorName: 'minlength',
        message: `${this.label} must have at least
          ${this.formControl?.errors?.['minlength']?.['requiredLength']} characters
          (currently ${this.formControl?.errors?.['minlength']?.['actualLength']} characters)`
      },
      {
        validatorName: 'maxlength',
        message: `${this.label} must have at most
          ${this.formControl?.errors?.['maxlength']?.['requiredLength']} characters 
          (currently ${this.formControl?.errors?.['maxlength']?.['actualLength']} characters)`
      },
      {
        validatorName: 'min',
        message: `${this.label} must be greater than ${this.formControl?.errors?.['min']?.['min']}`
      },
      {
        validatorName: 'max',
        message: `${this.label} must be lower than ${this.formControl?.errors?.['max']?.['max']}`
      },
      {
        validatorName: 'email',
        message: `Invalid email format`
      },
      {
        validatorName: 'pattern',
        message: this.getPatternMessage(this.formControl?.errors?.['pattern']?.['requiredPattern'])
      }
    ];

    // handle thisValidatorOnly
    if (this.thisValidatorOnly) {
      errorMessages = errorMessages.filter(err => err.validatorName.toLowerCase() === this.thisValidatorOnly.toLowerCase());
      this.config.customValidators = this.config.customValidators.filter(err => err.validatorName.toLowerCase() === this.thisValidatorOnly.toLowerCase());
    }

    // handle exclude
    if (this.exclude.length) {
      errorMessages = this.excludedValidatorsHandler(errorMessages);
      this.config.customValidators = this.excludedValidatorsHandler(this.config.customValidators);
    }

    // allow to overwrite a default message using customValidators
    const reducedErrorMessages = errorMessages.reduce((acc, curr) => {
      if (!acc.some(err => err.validatorName === curr.validatorName)) acc.push(curr);
      return acc;
    }, [...this.config.customValidators]);

    return this.formControl?.errors ? reducedErrorMessages.filter(err => this.formControl.errors.hasOwnProperty(err.validatorName)) : [];
  }

  getPatternMessage(requiredPattern: string | RegExp): string {
    return [...this.config.patternMessages, ...Regex.PATTERN_MESSAGES]
      .find(p => p.pattern == requiredPattern)?.message ?? `Invalid format (required pattern /${requiredPattern}/)`;
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