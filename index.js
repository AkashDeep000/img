ow let’s jump to our JavaScript code and complete a Dockerfile.

Combining Node.js Server and Chromium container
Before we continue, let’s change a little bit of our code to fit as a microservice for taking screenshots of given websites. For that, we’ll use Express.js to spin a basic HTTP server.

// server.js
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

// /?url=https://google.com
app.get('/', (req, res) => {
    const {url} = req.query;
    if (!url || url.length === 0) {
        return res.json({error: 'url query parameter is required'});
    }

    const imageData = await Screenshot(url);

    res.set('Content-Type', 'image/jpeg');
    res.set('Content-Length', imageData.length);
    res.send(imageData);
});

app.listen(process.env.PORT || 3000);

async function Screenshot(url) {
   const browser = await puppeteer.launch({
       headless: true,
       executablePath: '/usr/bin/chromium-browser',
       args: [
       "--no-sandbox",
       "--disable-gpu",
       ]
   });

    const page = await browser.newPage();
    await page.goto(url, {
      timeout: 0,
      waitUntil: 'networkidle0',
    });
    const screenData = await page.screenshot({encoding: 'binary', type: 'jpeg', quality: 70});

    await page.close();
    await browser.close();

    // Binary data of an image
    return screenData;
}