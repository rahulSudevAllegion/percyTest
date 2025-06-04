const puppeteer = require('puppeteer');
const percySnapshot = require('@percy/puppeteer');
const express = require('express');

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello Percy!");
});

// Start the Express server
const server = app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);

    try {
        // Launch Puppeteer browser instance
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navigate to the local server's URL
        await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle0' });

        // Take a Percy snapshot
        await percySnapshot(page, 'Home Page', {
            widths: [375, 768, 1280], // Example widths for responsive testing
            minHeight: 1024           // Minimum height for the snapshot
        });

        // Close the browser
        await browser.close();
    } catch (error) {
        console.error('Error taking Percy snapshot:', error);
    } finally {
        // Ensure the server is closed after the snapshot
        server.close(() => {
            console.log('Server closed.');
            process.exit();
        });
    }
});