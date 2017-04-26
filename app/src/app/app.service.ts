import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { Scheduler } from './scheduler';

export type InternalStateType = {
  [key: string]: any
};

@Injectable()
export class AppState {
  _state: InternalStateType = {};
  scheduler: Scheduler;

  constructor() {

    ipcRenderer.on('scheduler-tray-click', function (event, arg) {

    });

    ipcRenderer.on('scheduler-load', function (event, userDataDir, shedulesDataFile) {
        console.log("scheduler-load");

        this.scheduler = new Scheduler(userDataDir, shedulesDataFile);
        ipcRenderer.send('schedules-loaded', this.scheduler.schedulesData);
        this.scheduler.schedulerLoop();
    });
  }

  // already return a clone of the current state
  get state() {
    return this._state = this._clone(this._state);
  }

  // never allow mutation
  set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }


  get(prop?: any) {
    // use our state getter for the clone
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  set(prop: string, value: any) {
    // internally mutate our state
    return this._state[prop] = value;
  }


  private _clone(object: InternalStateType) {
    // simple object clone
    return JSON.parse(JSON.stringify(object));
  }
}
