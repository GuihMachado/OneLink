# Desktop Application Template

This serves as a base project to implement desktop applications. It's based on `Angular`, `Electron` and `Spartan UI Components`.

## Install dependencies
```bash
npm install
```

## Run the application

### Web Server
```bash
npm start
```
It should run a web application on `http://localhost:4200`
### Desktop Application
```bash
npm run electron
```
It should open a temporary desktop application
## Build the application
```bash
npm run build
```
This will generate the web bundle file in `dist/application`
### Electron package
```bash
npm run electron-package
```
This will create a package in `release/desktop-application-template-win32-x64`
### Electron Windows Installer
```bash
npm run electron-installer-win
```
This will create a windows installer in `release/windows-installer`