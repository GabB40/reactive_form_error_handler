import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { incrementVersion } from './../store/child2.actions';

@Component({
  templateUrl: './child2.component.html',
})
export class Child2Component {

  constructor(private store: Store) { }

  onIncrement() {
    this.store.dispatch(incrementVersion());
  }
}
