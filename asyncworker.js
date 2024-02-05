const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeUrl(url, browser) {
  try {
    console.log(`Scraping URL: ${url}`);
    const page = await browser.newPage();
    await page.goto(url);

    // Extract text content
    const content = await page.evaluate(() => {
      return document.body.innerText;
    });

    await page.close(); // Close the page after scraping

    return { url, content };
  } catch (error) {
    // Handle errors
    console.error(`Error scraping ${url}:`, error.message);
    return { url, content: null, error: error.message };
  }
}

async function scrapeWorker(urlList, browser) {
  const promises = urlList.map(url => scrapeUrl(url, browser));
  return Promise.all(promises);
}

(async () => {
  const fileContent = fs.readFileSync('links.txt', 'utf-8');
  const urls = fileContent.trim().split('\n');

  const browser = await puppeteer.launch();

  try {
    const results = await scrapeWorker(urls, browser);
    console.log(results);
    const finalResult = JSON.stringify(results, null, 2);
    fs.writeFileSync('scraped_results2.json', finalResult, 'utf-8');

  } catch (error) {
    console.error('Error in scraping:', error);
  } finally {
    await browser.close(); // Close the browser after all workers have finished
  }
})();

