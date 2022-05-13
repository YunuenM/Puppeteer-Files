const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    })
    const page = await browser.newPage()
    await page.goto("https://www.walmart.ca/search?q=6000200630082")
    //await page.goto("https://www.walmart.ca/search?q=6000198700643")
    const text = await page.evaluate(() => {
        return document.querySelector("div[class='css-1pjxmn6 epettpn4']").textContent
    })
    const transport = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
            user: "matthewxgong@gmail.com",
            pass: ""
        }
    })

    if(!text.startsWith("Out of stock")){
        const options = {
            from: "matthewxgong@gmail.com",
            to: "sarchen23@hotmail.com",
            subject: "Microwave Update: Available",
            text: "Available now!!!!! Speak to DAD ASAP! Link: https://www.walmart.ca/search?q=6000200630082"
        }
        await console.log("Available! Speak to Dad ASAP!")
        await transport.sendMail(options, async function(err, info){
            if(err){
                await console.log(err)
            }
            else{
                await console.log('Email sent: ' + info.response);
            }
        })
    }
    else{
        var d = new Date()
        var hour = await d.getHours()
        if(hour == 15){
            const options = {
                from: "matthewxgong@gmail.com",
                to: "sarchen23@hotmail.com",
                subject: "Microwave Update: Not Available",
                text: "Still not available."
            }
            await console.log("Still not available")
            await transport.sendMail(options, async function(err, info){
                if(err){
                    await console.log(err)
                }
                else{
                    await console.log('Email sent: ' + info.response);
                }
            })
        }
    }
    await browser.close()
})();
