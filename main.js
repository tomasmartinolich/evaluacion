const { app, BrowserWindow } = require("electron");
const Store = require("electron-store");

let appWin;

const store = new Store();

createWindow = () => {
    appWin = new BrowserWindow({
        width: 1024,
        height: 768,
        title: "Evaluación nutricional de la embarazada",
        resizable: true,
        openDevTools: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });
    
    appWin.loadURL(`file://${__dirname}/dist/index.html`);

    appWin.setMenu(null);

    // appWin.webContents.openDevTools();

    appWin.on("closed", () => {
        appWin = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
});