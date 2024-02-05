const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

let browser; // Declare the browser outside the functions to share it

async function summarizeFromText(textContent) {
  try {
    const prompt = `Summarize the given content in 30 words: ${textContent}`;
    const data = {
      model: 'stablelm2',
      prompt: prompt,
      num_ctx: 4096,
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
    const page = await browser.newPage();
    await page.goto(url);

    const content = await page.evaluate(() => document.body.innerText);

    await page.close();
    const summary = await summarizeFromText(content);
    console.log(`summery of ${url} is =>${summary.response}`)

    return { url, content, summary };
  } catch (error) {
    console.error(`Error during scraping and summarization: ${error}`);
    return { url, error: 'Failed to scrape or summarize' };
  }
}

async function scrapeAndSummarizeAll(urls) {
  try {
    browser = await puppeteer.launch();

    const results = await Promise.all(urls.map(url => scrapeAndSummarize(url)));
    return results;
  } catch (error) {
    console.error('Error during Promise.all:', error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Example usage with a list of URLs
/*const urlList = ['https://en.wikipedia.org/wiki/Raven',
	'https://dhwthompson.com/2019/my-favourite-git-commit',
	'https://en.wikipedia.org/wiki/Integer_sorting',
'https://santhoughts.netlify.app/post/dreams/'];
*/
const urlList = fs
  .readFileSync('links.txt', 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((url) => url.trim());

scrapeAndSummarizeAll(urlList)
  .then((results) => {
    results.forEach((result) => {
	console.log(`summary done for ${result.url} `)
      //console.log(`Content from ${result.url}:\n${result.content}\n`);
//      console.log(`Summary for ${result.url}:\n${JSON.stringify(result.summary.response)}\n`);
    });
  })
  .catch((error) => {
    console.error('Error during scraping and summarization:', error);
  });

