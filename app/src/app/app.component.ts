import { Component, ViewContainerRef } from '@angular/core';

import { GlobalState } from './global.state';

import 'style-loader!./app.scss';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  template: `
    <h1>Hello Angular4 (?)</h1>
  `
})
export class App {
  constructor(private _state: GlobalState) {
  }

  public ngAfterViewInit(): void {
    // hide spinner once all loaders are completed
  }
}
