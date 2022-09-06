import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'form-error-handler',
  templateUrl: './form-error-handler.component.html',
})
export class FormErrorHandlerComponent implements OnInit {
  @Input('formGroup') formGroup: FormGroup;
  @Input('name') name: string;
  capitalizedName: string;

  ngOnInit(): void {
    this.capitalizedName = this.name ? this.name[0].toUpperCase() + this.name.slice(1) : '';
  }
}
