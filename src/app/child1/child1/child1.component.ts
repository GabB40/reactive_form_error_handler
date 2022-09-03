import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { incrementVersion } from './../store/child1.actions';

@Component({
  templateUrl: './child1.component.html',
})
export class Child1Component {

  constructor(private store: Store) { }

  onIncrement() {
    this.store.dispatch(incrementVersion());
  }
}
