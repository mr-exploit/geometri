const { Builder, By } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const fs = require('fs');
const path = require('path');
const { tambahkanLogError } = require('./logerror');
require("dotenv").config();

async function extraFileXML(driver, line, mcName, outputFolder) {
    let urlOpenFlexa = `http://flexaserver/fujiweb/fujimoni/UI/ModuleInformation.aspx?Line=${line}&McName=${mcName}`;

    const DonwloadFolderPath = process.env.DONWLOADFOLDER_PATH;
    try {
        await driver.get(urlOpenFlexa);
        
        await driver.findElement(By.id('RadioButton2')).click();
        await driver.findElement(By.id('ImageButtonXml')).click();

        // Additional actions here if needed
        // await sleep(5000); // Wait for 5 seconds
        // Move the file to the desired folder
        const sourceFilePath = `${DonwloadFolderPath}/${mcName}_UnitInfo.xml`; // Update with your actual file path
        const destinationFolderPath = path.join(outputFolder, `${line} PROCESSED NOZZLE.xml`);

        fs.renameSync(sourceFilePath, destinationFolderPath);
        console.log(`File moved to ${destinationFolderPath}`);
        // Additional actions here if needed
        await sleep(5000); // Wait for 5 seconds
    } catch (error) {
        console.log("cek error", error)
        const ErrorLog = `cek error export xml : ${error}`
        tambahkanLogError(ErrorLog)
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function loopURLs() {
    // let outputFolder = 'D:/projectDOT'; // Update with your desired output folder
    const outputFolderPath = process.env.FOLDER_PATH;
    let firefoxOptions = new firefox.Options();
    firefoxOptions.addArguments('--enable-firefox-browser-cloud-management');

    let driver = new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(firefoxOptions)
        .build();

    try {
        for (let i = 1; i <= 16; i++) {
            let line = `LINE+${i}`;
            let mcName = `NXT${i}_A`;
            if(i === 9){
                line = `LINE+${i}`;
                mcName = `NXT_${i}A`;
            }

            if(i === 10){
                continue;
            }

            if(i === 13){
                let change = 21
                line = `LINE+${change}`;
                mcName = `NXT${change}_A`;
            }
            if(i === 14){
                let change = 22
                line = `LINE+${change}`;
                mcName = `NXT${change}_A`;
            }
            if(i === 15){
                let change = 23
                line = `LINE+${change}`;
                mcName = `NXT${change}_A`;
            }
            if(i === 16){
                let change = 24
                line = `LINE+${change}`;
                mcName = `NXT${change}_A`;
            }
            await extraFileXML(driver, line, mcName, outputFolderPath);
            // return
            // Add a sleep or wait if needed before proceeding to the next iteration
            // await sleep(1000);
        }
    } finally {
        await driver.quit(); // Close the browser after the loop is finished
    }
}

module.exports={
    loopURLs
}
