const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

function getLinks(){
    const access = path.join(process.cwd(), "/Documents/CodingFiles/Javascript/Puppeteer/site.html");
    var data = fs.readFileSync(access, 'utf8');
    var table = data.split("\n").map(function (row) { return row.split(" "); })
    var links = table.map(function (row) { return row[1].slice(6, -1); })
    return links;
}

async function check(url){
    try {
        console.log("I am here");
        const access = path.join(process.cwd(), "/Documents/CodingFiles/Javascript/Puppeteer/site.html");
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: '/Users/grace/Documents/CodingFiles/Javascript/Puppeteer/chromium/.local-chromium/mac-782078/chrome-mac/Chromium.app/Contents/MacOS/Chromium'
        });
        const page = await browser.newPage();
        console.log("I am hmmmmm");        
        await page.setDefaultNavigationTimeout(0);
        await page.goto(url);
        const newest = await page.evaluate(() => {
            return document.querySelector("span[class='atc_tm SG_txtc']").textContent;
        });
        await browser.close();
        console.log("I am here 2");
        const fileStream = fs.createReadStream(access);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        let time = "";
        let final = "";
        let updateTable = "";
        for await(const line of rl){
            let pos = line.search(url);
            if(pos != -1){
                time = line.slice(99, 115);
                final = line.slice(116, -4);
            }
        }
        console.log("I am here 3");
        if(time == newest){
            console.log("No update yet!");
            updateTable = "Still Waiting";
        }
        else{
            console.log("Yes Update!");
            updateTable = "New Update!";
        }

        let data = fs.readFileSync(access, 'utf8');
        let newData = data.replace(url + "' target='_blank'>Website</a><p> " + time + " " + final, url + "' target='_blank'>Website</a><p> " + newest + " " + updateTable);
        console.log("I am here 4");
        fs.writeFileSync(access, newData);
    }
    catch (e) {
        console.log(e);
    }
}

let websites = getLinks();
for(let i = 0; i < websites.length; i++){
    check(websites[i]);
}