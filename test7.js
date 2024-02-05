const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

const mongoose = require('mongoose');
const { UrlModel }  = require('model/ModelSchema.js');
const { connect } = require('model/Connection.js');

let browser; // Declare the browser outside the functions to share it

async function databaseSync(urldata,summarydata)
{


const Urldump = new UrlModel({url:urldata,summary:summarydata})

try {
	
	await Urldump.save().then(async ()=> {console.log(`url and summary of ${urldata} saved!`)

	urlsdumps = await UrlModel.find()
	console.log(`Url dumps => ${urlsdumps}`)
	}).catch( async (error) =>
		{

		console.log('this error=>'+error)
		urlsdumps = await UrlModel.find()
		console.log(`Url dumps => ${urlsdumps}`)
		})
  
} catch (err) {
  console.error('Error saving URL:', err);
  
  if (err instanceof mongoose.Error.ValidatorError && err.errors.url) {
    console.error('URL already exists in the database.');
  } else {
    console.error('Unexpected error occurred while saving the URL.');
  }
}
finally{

mongoose.connection.close().then(()=>{console.log('connection closed!')});
}


}
async function summarizeFromText(textContent) {
  try {
	// context length of llama is 4096 and mistral is 32768
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
    console.log(`\n\n summery of ${url} is =>${summary.response} \n\n`)

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

//Reading links from file 
const urlList = fs
  .readFileSync('links.txt', 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((url) => url.trim());

//Mongodb connection 
connect('mongodb://localhost/Summarydb')
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error('Error connecting to database:', err));

//Summarize and scraping operation
scrapeAndSummarizeAll(urlList)
  .then((results) => {
    results.forEach((result) => {
	console.log(`summary done for ${result.url} `)
      //console.log(`Content from ${result.url}:\n${result.content}\n`);
	//console.log(`Summary for ${result.url}:\n${JSON.stringify(result.summary.response)}\n`);
    });
  })
  .catch((error) => {
    console.error('Error during scraping and summarization:', error);
  });

