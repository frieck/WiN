import { ipcRenderer } from 'electron';
import { Scheduler } from './schedulers';


(function () {

    'use strict';

    var scheduler: Scheduler;

    ipcRenderer.on('scheduler-tray-click', function (event, arg) {

    });

    ipcRenderer.on('scheduler-load', function (event, userDataDir, shedulesDataFile) {
        console.log("scheduler-load");

        scheduler = new Scheduler(userDataDir, shedulesDataFile);
        ipcRenderer.send('schedules-loaded', scheduler.schedulesData);

        scheduler.schedulerLoop();

    });

}());
