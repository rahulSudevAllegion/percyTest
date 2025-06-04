const puppeteer = require('puppeteer');
const percySnapshot = require('@percy/puppeteer');
const express = require('express');

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello Percy!");
});

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle0' });

    // Take a Percy snapshot
    await percySnapshot(page, 'Home Page');

    await browser.close();
    process.exit();
});