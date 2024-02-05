const puppeteer = require('puppeteer');
const axios = require('axios');

async function summarizeFromText(textContent) {
  try {
    const prompt = `Summarize the given content in 20 words: ${textContent}`;
    const data = {
      model: 'mistral',
      prompt: prompt,
      stream: false,
    };

    const response = await axios.post('http://localhost:11434/api/generate', data);
    return response.data;
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    return 1;
  }
}

async function scrapeAndSummarize(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const content = await page.evaluate(() => document.body.innerText);

    await page.close();
    const summary = await summarizeFromText(content);

    return { url, content, summary };
  } catch (error) {
    console.error(`Error during scraping and summarization: ${error}`);
    return { url, error: 'Failed to scrape or summarize' };
  }
}

async function scrapeAndSummarizeAll(urls) {
  try {
    const results = await Promise.all(urls.map(url => scrapeAndSummarize(url)));
    return results;
  } catch (error) {
    console.error('Error during Promise.all:', error);
    return [];
  }
}

// Example usage with a list of URLs
const urlList = ['https://en.wikipedia.org/wiki/Raven', 'https://santhoughts.netlify.app/post/dreams/'];

scrapeAndSummarizeAll(urlList)
  .then((results) => {
    results.forEach((result) => {
      //console.log(`Content from ${result.url}:\n${result.content}\n`);
      console.log(`Summary for ${result.url}:\n${JSON.stringify(result.summary.response)}\n`);
    });
  })
  .catch((error) => {
    console.error('Error during scraping and summarization:', error);
  });

