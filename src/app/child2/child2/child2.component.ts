import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMessage } from '@gabb40/reactive-form-error-messages/lib/reactive-form-error-messages.interface';
import { PatternMessages } from '@gabb40/reactive-form-error-messages/lib/reactive-form-error-messages.regex';
import { ReactiveFormErrorMessagesRegex, ReactiveFormErrorMessagesService } from '@gabb40/reactive-form-error-messages';
import { Store } from '@ngrx/store';
import { smallerThan10, smallerThan30 } from '../../validators';
import { initialState } from '../store';
import { updateData } from './../store/child2.actions';
import { selectChild2Data } from './../store/child2.selectors';


@Component({
  templateUrl: './child2.component.html',
  styleUrls: ['./child2.component.scss'],
  providers: [ReactiveFormErrorMessagesService] // IMPORTANT : singleton of service at component level !
})
export class Child2Component implements OnInit {

  formChild2!: FormGroup;
  formData$ = this.store.select(selectChild2Data);
  maxTodos = 3;
  hasMaxTodosError: boolean = false;

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private reactiveFormErrorMessagesService: ReactiveFormErrorMessagesService
  ) { }

  ngOnInit(): void {
    this.formChild2 = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8), Validators.pattern(ReactiveFormErrorMessagesRegex.ALNUM)]],
      version: ['', [Validators.required, smallerThan10(), smallerThan30(), Validators.min(5), Validators.max(99), Validators.pattern(ReactiveFormErrorMessagesRegex.NUM)]],
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
      { pattern: ReactiveFormErrorMessagesRegex.NUM, message: 'IMHO You just fail' },
      { pattern: ReactiveFormErrorMessagesRegex.ALNUM, message: 'BOUYAAAAAAAAA !' }
    ];

    this.reactiveFormErrorMessagesService.setConfig({
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
          todo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(ReactiveFormErrorMessagesRegex.ALNUMSP)]],
          priority: ['', [Validators.required, Validators.min(1), Validators.max(5), Validators.pattern(ReactiveFormErrorMessagesRegex.NUM)]]
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
    else this.reactiveFormErrorMessagesService.emitValueChanges(this.formChild2);
  }

}
