const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const puppeteer = require('puppeteer');

async function scrapeUrl(url) {
  try {
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

if (isMainThread) {
  // Main thread
  const urls = [
    'https://en.wikipedia.org/wiki/Raven',
    'https://santhoughts.netlify.app/post/dreams/',
  ];

  // Split the URLs for each worker
  const chunkSize = Math.ceil(urls.length / 4);
  const urlChunks = Array.from({ length: 4 }, (_, index) =>
    urls.slice(index * chunkSize, (index + 1) * chunkSize)
  );

  // Create worker threads
  const workers = [];
  for (const chunk of urlChunks) {
    const worker = new Worker(__filename, { workerData: chunk });

    // Add error event listener
    worker.on('error', (error) => {
      console.error('Worker error:', error);
    });

    workers.push(worker);
  }

  // Collect results from workers
  const results = [];
  for (const worker of workers) {
    worker.on('message', (result) => {
      results.push(...result);
      if (results.length === urls.length) {
        // All workers have finished
        console.log('Scraping done:', results);
      }
    });
  }
} else {
  // Worker thread
  scrapeWorker(workerData)
    .then(result => {
      parentPort.postMessage(result);
    })
    .catch(error => {
      console.error('Worker error:', error);
    });
}

