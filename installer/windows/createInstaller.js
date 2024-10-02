const electronInstaller = require('electron-winstaller');

async function start() {
    console.log('creating windows installer');
    try {
        await electronInstaller.createWindowsInstaller({
            appDirectory: 'release/desktop-application-template-win32-x64/',
            authors: 'Tooling',
            noMsi: true,
            outputDirectory: 'release/windows-installer',
            exe: 'desktop-application-template.exe',
            setupExe: 'application.exe',
            description: 'Desktop basic application'
        });
        console.log('Finished to generate windows installer in release/windows-installer');
    } catch (e) {
        console.log(`No dice: ${e.message}`);
    }
}

start();
