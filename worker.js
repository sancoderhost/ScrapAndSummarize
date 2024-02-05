const { parentPort, workerData } = require('worker_threads');
const puppeteer = require('puppeteer');

async function scrapeUrl(url) {
  try {
   console.log(`Scraping URL: ${url}`);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Extract text content
    const content = await page.evaluate(() => {
      return document.body.innerText;
    });

    await browser.close();

    return { url, content };
  } catch (error) {
    // Handle errors
    console.error(`Error scraping ${url}:`, error.message);
    return { url, content: null, error: error.message };
  }
}

function scrapeWorker(urlList) {
  const promises = urlList.map(url => scrapeUrl(url));
  return Promise.all(promises);
}

// Worker thread
scrapeWorker(workerData)
  .then(result => {
    parentPort.postMessage(result);
  })
  .catch(error => {
    console.error('Worker error:', error);
  });

