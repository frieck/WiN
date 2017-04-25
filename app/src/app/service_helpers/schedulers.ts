import { ipcRenderer } from 'electron';
import parseDuration from 'parse-duration';
var  jetpack = require('fs-jetpack');

export class Scheduler {
  private schedulerStatus: string;
  private loopTimeout: number;
  private snoozeTime: number;
  public schedulesData: any;

  constructor (dir: string, schedulesDataFile: string) {
    this.schedulerStatus = "running";
    this.loopTimeout = 1000;
    this.snoozeTime = 1 * 60000;
    this.schedulesData = this.schedulerReader(dir, schedulesDataFile)
  }

  private schedulerReader(dir, schedulesDataFile): any {
    var userDataDir = jetpack.cwd(dir);
    var data = {};
    try {
      data = userDataDir.read(schedulesDataFile, 'json');
    } catch (err) {
      // For some reason json can't be read (might be corrupted).
      // No worries, we have defaults.
      // TODO: DO WE?!
    }

    return data;
  }

  public schedulerLoop () {
    if(this.schedulesData) {
      var schedules = this.schedulesData.schedules;
      if(schedules) {
        for(let i=0; i<schedules.length; i++) {
          if(schedules[i].status == undefined && schedules[i].duration != undefined) {
            schedules[i]['status'] = "started";
            schedules[i]['alarm'] = new Date().getTime() + parseDuration(schedules[i].duration);
          }

          if(schedules[i].alarm <= new Date().getTime()) {
            var alarm = new Date(schedules[i].alarm);
            var alarmStr = (alarm.getHours() < 10 ? "0" +  alarm.getHours() :  alarm.getHours())
              + ":" + (alarm.getMinutes() < 10 ? "0" +  alarm.getMinutes() :  alarm.getMinutes())
              + ":" + (alarm.getSeconds() < 10 ? "0" +  alarm.getSeconds() :  alarm.getSeconds());

            let myNotification = new Notification(schedules[i].name + " (" + alarmStr + ")", {
              body: schedules[i].description + '\n\nClique para silenciar ou feche para encerrar.'
            });

            myNotification.onclick = () => {
              delete schedules[i].status;
              schedules[i]['alarm'] = new Date().getTime() + this.snoozeTime;
            };

            myNotification.onclose = () => {
              schedules[i].status = "done";
            };

            schedules[i].status = "completed";
            delete schedules[i].alarm;
          }
        }
      }
    }
    setTimeout(this.schedulerLoop, this.loopTimeout);
  }
}