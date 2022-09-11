import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ErrorMessage } from '../../form-error-handler/form-error-handler.component';
import { initialState } from '../store';
import { updateData } from './../store/child1.actions';
import { selectChild1Data } from './../store/child1.selectors';
import { smallerThan10, smallerThan30 } from './validators';


@Component({
  templateUrl: './child1.component.html',
  styleUrls: ['./child1.component.scss']
})
export class Child1Component implements OnInit {

  customValidators!: ErrorMessage[];
  formDemo!: FormGroup;
  formData$ = this.store.select(selectChild1Data);
  maxTodos = 3;
  hasMaxTodosError: boolean = false;

  constructor(private store: Store, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formDemo = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8), Validators.pattern('[a]*')]],
      version: ['', [Validators.required, smallerThan10(), smallerThan30(), Validators.min(5), Validators.max(99), Validators.pattern('^(0|[1-9][0-9]*)$')]],
      todos: this.formBuilder.array(
        [],
        [Validators.maxLength(this.maxTodos)]
      )
    });

    this.customValidators = [
      { validatorName: 'smallerThan10', message: 'It\'s smaller than 10' },
      { validatorName: 'smallerThan30', message: 'It\'s smaller than 30' },
      { validatorName: 'required', message: 'It\'s fucking awesome' } // eg: overwrite of a default error message
    ];
  }

  get todos(): FormArray {
    return this.formDemo.controls['todos'] as FormArray;
  }

  onAddTodo() {
    if (this.todos.length < this.maxTodos) {
      this.todos.push(
        this.formBuilder.group({
          todo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
          priority: ['', [Validators.required, Validators.min(1), Validators.max(5)]]
        })
      );
    } else this.hasMaxTodosError = true;
  }

  onRemoveTodo(todoIndex: number) {
    this.todos.removeAt(todoIndex);
    this.hasMaxTodosError = false;
  }

  onSubmit() {
    this.store.dispatch(updateData({ ...initialState, ...this.formDemo.value }));
  }
}
