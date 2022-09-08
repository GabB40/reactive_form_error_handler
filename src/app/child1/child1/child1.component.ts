import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { initialState } from '../store';
import { CustomValidator } from './../form-error-handler/form-error-handler.component';
import { updateData } from './../store/child1.actions';
import { selectChild1Data } from './../store/child1.selectors';
import { smallerThan10, smallerThan30 } from './validators';


@Component({
  templateUrl: './child1.component.html',
  styleUrls: ['./child1.component.scss']
})
export class Child1Component implements OnInit {

  customValidators!: CustomValidator[];
  formDemo!: FormGroup;
  formData$ = this.store.select(selectChild1Data);

  constructor(private store: Store, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formDemo = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8), Validators.pattern('[a]*')]],
      version: ['', [Validators.required, smallerThan10(), smallerThan30(), Validators.min(5), Validators.max(99), Validators.pattern('^(0|[1-9][0-9]*)$')]]
    });

    this.customValidators = [
      { name: 'smallerThan10', message: 'It\'s smaller than 10' },
      { name: 'smallerThan30', message: 'It\'s smaller than 30' },
    ];
  }
  onSubmit() {
    this.store.dispatch(updateData({ ...initialState, ...this.formDemo.value }));
  }
}
