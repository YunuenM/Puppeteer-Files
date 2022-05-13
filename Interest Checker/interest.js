const puppeteer = require('puppeteer');
const fs = require('fs');

async function openWebsite(dates){
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto("https://derivatives.hnx.vn/web/phai-sinh/ket-qua-giao-dich");
    for (let i = 0; i < dates.length; i++){
        console.log(dates[i]);
        let input = await page.$("input[class='date hasDatepicker']");
        if(input == null) input = await page.$("input[class='date hasDatepicker focus']");

        await input.click({ clickCount: 3 });
        await input.type(dates[i]);
        await page.click("div[class='fg-toolbar ui-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix']");
        await page.waitForTimeout(1000);
        //let codes = await page.evaluate(() => Array.from(document.querySelectorAll("td[class='left positionmck']")));
        let codes = await page.$$("td[class='left positionmck']");
        let select = await page.$("div[class='dataTables_info']");
        let limit = await (await select.getProperty('textContent')).jsonValue();
        for(let i = 0; i < parseInt(limit.slice(-4, -2)); i++){
            //console.log(i);
            let text = await (await codes[i].getProperty('textContent')).jsonValue();
            if(text.includes("VN30F")){
                let parent = await codes[i].getProperty('parentNode');
                let data = await parent.$$("td[class='right']");
                let content = await (await data[data.length - 3].getProperty('textContent')).jsonValue();
                console.log(content);
            }
        }
    }
    await browser.close();
}

let data = fs.readFileSync("answer.txt", "utf8");
//console.log(data.split("\n"));
openWebsite(data.split("\n"));
