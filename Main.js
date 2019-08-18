const { app, BrowserWindow } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


const {ipcMain}  = require('electron');

//ipcMain.on will receive the “btnclick” info from renderprocess 
ipcMain.on("btnclick",function (event) {

  //create new window
  var newWindow    = new BrowserWindow({ width: 450, height: 300, show: 
                                        false,webPreferences: {webSecurity: false,plugins:
                                        true,nodeIntegration: false} });  // create a new window

  var facebookURL  =  "https://www.facebook.com"; // loading an external url. We can load our own another html file, like how we load index.html earlier

  newWindow.loadURL(facebookURL);
  newWindow.show();
                             
 // inform the render process that the assigned task finished. Show a message in html
 // event.sender.send in ipcMain will return the reply to renderprocess
 GetData('Golf',function(result) {
    event.sender.send("btnclick-task-finished", result);
 });

});


const https = require('https');


async function GetData(target, result)
{

const apiURl = 'https://graph.facebook.com/search?type=adinterest&q=[' +  target + ']&limit=10000&locale=en_US&access_token=2334601333305211|ixo93bORPMZUVQVdib6xNSHtG-Y';

  let FinalString = '';
  await https.get(apiURl, (resp) => {
      let jsonString = '';

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        jsonString += chunk;
      });


      let dataArray = '';
      // The whole response has been received. Print out the result.
      resp.on('end', () => {

        console.log("\n  Parsed JSON: \n");

        dataArray = JSON.parse(jsonString);

        for(var i = 0; i < dataArray.data.length; i++)
        {
          FinalString += dataArray.data[i].name + '\n';
          FinalString += dataArray.data[i].audience_size + '\n \n';

        }

      console.log(FinalString);
      
      result('' + FinalString);
      //return FinalString;

    });

  }).on("error", (err) => {
      console.log("Error: " + err.message);

    });

}