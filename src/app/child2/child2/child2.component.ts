import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { smallerThan10, smallerThan30 } from '../../validators';
import { initialState } from '../store';
import { ErrorMessage } from './../../form-error-handler/form-error-handler.interface';
import { FormErrorHandlerService } from './../../form-error-handler/form-error-handler.service';
import { PatternMessages, Regex } from './../../form-error-handler/regex';
import { updateData } from './../store/child2.actions';
import { selectChild2Data } from './../store/child2.selectors';


@Component({
  templateUrl: './child2.component.html',
  styleUrls: ['./child2.component.scss'],
  providers: [FormErrorHandlerService] // IMPORTANT : singleton of service at component level !
})
export class Child2Component implements OnInit {

  formChild2!: FormGroup;
  formData$ = this.store.select(selectChild2Data);
  maxTodos = 3;
  hasMaxTodosError: boolean = false;

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private formErrorHandlerService: FormErrorHandlerService
  ) { }

  ngOnInit(): void {
    this.formChild2 = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8), Validators.pattern(Regex.ALNUM)]],
      version: ['', [Validators.required, smallerThan10(), smallerThan30(), Validators.min(5), Validators.max(99), Validators.pattern(Regex.NUM)]],
      todos: this.formBuilder.array(
        [],
        [Validators.maxLength(this.maxTodos)]
      )
    });

    const customValidators: ErrorMessage[] = [
      { validatorName: 'smallerThan10', message: 'It\'s smaller than 10' },
      { validatorName: 'smallerThan30', message: 'It\'s smaller than 30' },
      { validatorName: 'required', message: 'You\'re a fucking genious !' } // eg: overwrite of a default error message
    ];

    const patternMessages: PatternMessages[] = [
      { pattern: Regex.NUM, message: 'IMHO You just fail' },
      { pattern: Regex.ALNUM, message: 'BOUYAAAAAAAAA !' }
    ];

    this.formErrorHandlerService.setConfig({
      formGroup: this.formChild2,
      debounceTime: 0,
      messagesCountLimit: 3,
      customValidators,
      patternMessages,
      exclude: ['smallerThan10', 'smallerThan30']
    });
  }

  get todos(): FormArray {
    return this.formChild2.controls['todos'] as FormArray;
  }

  onAddTodo() {
    if (this.todos.length < this.maxTodos) {
      this.todos.push(
        this.formBuilder.group({
          todo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(Regex.ALNUMSP)]],
          priority: ['', [Validators.required, Validators.min(1), Validators.max(5), Validators.pattern(Regex.NUM)]]
        })
      );
    } else this.hasMaxTodosError = true;
  }

  onRemoveTodo(todoIndex: number) {
    this.todos.removeAt(todoIndex);
    this.hasMaxTodosError = false;
  }

  onSubmit() {
    if (this.formChild2.valid)
      this.store.dispatch(updateData({ ...initialState, ...this.formChild2.value }));
    else this.formErrorHandlerService.emitValueChanges(this.formChild2);
  }
  
}
