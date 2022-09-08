import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';


export interface CustomValidator {
  name: string;
  message: string;
}

@Component({
  selector: 'form-error-handler',
  templateUrl: './form-error-handler.component.html',
  styleUrls: ['./form-error-handler.component.scss']
})
export class FormErrorHandlerComponent implements OnInit {
  @Input('formGroup') formGroup: FormGroup;
  @Input('name') name: string;

  @Input('exclude') exclude: string | string[] = [];
  @Input('thisValidatorOnly') thisValidatorOnly?: string;
  @Input('firstMessageOnly') firstMessageOnly: boolean = false;
  @Input('customValidators') customValidators?: CustomValidator[];
  capitalizedName: string;

  ngOnInit(): void {
    this.capitalizedName = this.name ? this.name[0].toUpperCase() + this.name.slice(1) : '';
    console.log('******', this.formGroup.controls[this.name].errors);
  }

  isDisplayed(validatorName: string): boolean {
    return this.formGroup.controls[this.name].hasError(validatorName)
      && (this.thisValidatorOnly ? this.thisValidatorOnly.toLowerCase() === validatorName : !this.isExcluded(validatorName));
  }

  isExcluded(validatorName: string): boolean {
    return Array.isArray(this.exclude) ?
      this.exclude.map(v => v.toLowerCase()).includes(validatorName)
      : this.exclude.toLowerCase() === validatorName.toLowerCase();
  }

}