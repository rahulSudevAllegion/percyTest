const puppeteer = require('puppeteer');
const percySnapshot = require('@percy/puppeteer');
const express = require('express');

const app = express();
const port = 3000;

// Define the Express route
app.get("/", (req, res) => {
    res.send("Hello Matt!");
});

// Start the Express server
const server = app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);

    try {
        // Launch Puppeteer with executable path explicitly set
        const browser = await puppeteer.launch({
            headless: 'new', // Use new headless mode
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ], // Ensure compatibility with CI environments
            ignoreDefaultArgs: ['--disable-extensions'],
        });

        const page = await browser.newPage();

        // Navigate to the local server's URL
        await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle0' });

        // Take a Percy snapshot with options
        await percySnapshot(page, 'Home Page', {
            widths: [375, 768, 1280], // Responsive widths
            minHeight: 1024,          // Minimum height
        });

        // Close the Puppeteer browser
        await browser.close();
    } catch (error) {
        console.error('Error taking Percy snapshot:', error);
    } finally {
        // Close the Express server
        server.close(() => {
            console.log('Server closed.');
            process.exit();
        });
    }
});