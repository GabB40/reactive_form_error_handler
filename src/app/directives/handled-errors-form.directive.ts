import { ContentChild, Directive } from '@angular/core';
import { FormControlDirective } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
/**
 * @Info failure :()
 */
@Directive({
  selector: '[handledErrorsForm]',
})
export class HandledErrorsFormDirective {
  @ContentChild(FormControlDirective)
  set formControl(formControl: FormControlDirective) {
    this._formControl$.next(formControl);
  }

  get formControl$() {
    return this._formControl$.asObservable();
  }

  private _formControl$ = new ReplaySubject<FormControlDirective>(1);
}