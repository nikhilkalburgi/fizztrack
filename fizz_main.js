const {app,BrowserWindow,ipcMain} = require('electron');
// app initialization
app.whenReady().then(()=>{
    // window frame begins
    let win = new BrowserWindow({minHeight:75,minWidth:600,show:false,autoHideMenuBar:true,frame:false,icon:'logo.ico',title:' FizzTrack',webPreferences:{nodeIntegration:true}});
    win.webContents.openDevTools();
    // loading the html data to app
    win.loadFile('fizz_renderer.html');
    win.once('ready-to-show',()=>{
            win.show();

        })

    ipcMain.on('fullscreen',(err,arg)=>{
        win.setFullScreen(true);
    })

    ipcMain.on('restore',(err,arg)=>{
        win.setFullScreen(false);
    })

    ipcMain.on('minimize',(events)=>{
            win.minimize();
        })
    ipcMain.on('maximize',(events)=>{
            win.maximize();
        })
    ipcMain.on('unmaximize',(events)=>{
            win.unmaximize();
        })

        if(process.argv != null){
            console.log(process.argv)
            ipcMain.once('init',(events)=>{
                events.reply('file_to_exec',process.argv)
            })   
        }
});

