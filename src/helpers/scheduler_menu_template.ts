export default function (app, mainWindow, schedulesData?) {

  var schedulesMenuTemplate = {
      label: 'Agenda',
      submenu: [

      ]
  };

  var menuHasItens = false;

  if(schedulesData) {
    var schedules = schedulesData.schedules;
    if(schedules) {
        for(let i=0; i<schedules.length; i++) {
          var data = {};
          data['label'] = schedules[i].name;
          if(schedules[i].duration) {
            data['label'] += "(" + schedules[i].duration + ")";
          }
          data['click'] = function () {
              mainWindow.webContents.send('scheduler-tray-click', schedules[i].id);
          };
          schedulesMenuTemplate.submenu.push(data);
          menuHasItens = true;
        }
    }
  }

  return schedulesMenuTemplate;

}
