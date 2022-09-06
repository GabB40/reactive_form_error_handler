import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { initialState } from '../store';
import { updateData } from './../store/child1.actions';
import { selectChild1Data } from './../store/child1.selectors';

@Component({
  templateUrl: './child1.component.html',
})
export class Child1Component {

  formData$ = this.store.select(selectChild1Data);

  form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8), Validators.pattern('[a]*')]],
    version: ['', [Validators.required, Validators.min(1), Validators.max(10)]]
  });

  constructor(private store: Store, private formBuilder: FormBuilder) { }

  onSubmit() {
    this.store.dispatch(updateData({ ...initialState, ...this.form.value }));
  }
}
