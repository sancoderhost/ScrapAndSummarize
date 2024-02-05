const puppeteer = require('puppeteer');

async function scrapeHumanReadableContent(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const humanReadableContent = await page.evaluate(() => {
    // Extract text content from the entire document
    const allContent = document.body.textContent.trim();

    // Remove HTML tags and other non-human-readable content
    const regex = /<[^>]*>|&[^;]+;/g;
    return allContent.replace(regex, '');
  });

  await browser.close();

  return humanReadableContent;
}

// Example usage
const targetUrl = 'https://en.wikipedia.org/wiki/Raven';
scrapeHumanReadableContent(targetUrl)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error('Error during scraping:', error);
  });

