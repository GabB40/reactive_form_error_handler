import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface customValidator {
  name: string;
  message: string;
}


@Component({
  selector: 'form-error-handler',
  templateUrl: './form-error-handler.component.html',
})
export class FormErrorHandlerComponent implements OnInit {
  @Input('formGroup') formGroup: FormGroup;
  @Input('name') name: string;

  @Input('exclude') exclude: string | string[] = [];
  @Input('only') only?: string;
  @Input('class') class?: string;
  @Input('style') style?: string;
  @Input('customValidators') customValidators?: customValidator[];
  capitalizedName: string;

  ngOnInit(): void {
    this.capitalizedName = this.name ? this.name[0].toUpperCase() + this.name.slice(1) : '';
    console.log('******', this.formGroup.controls[this.name].errors);
  }

  isDisplayed(validatorName: string): boolean {
    return this.formGroup.controls[this.name].hasError(validatorName)
      && (this.only ? this.only.toLowerCase() === validatorName : !this.isExcluded(validatorName));
  }

  isExcluded(validatorName: string): boolean {
    return Array.isArray(this.exclude) ?
      this.exclude.map(v => v.toLowerCase()).includes(validatorName)
      : this.exclude.toLowerCase() === validatorName.toLowerCase();
  }

}