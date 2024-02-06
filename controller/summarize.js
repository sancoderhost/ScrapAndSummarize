//Declaring function to summarize
//

const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

const mongoose = require('mongoose');
const { UrlModel }  = require('../model/ModelSchema.js');
const { connect } = require('../model/Connection.js');

connect('mongodb://localhost/Summarydb')
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error('Error connecting to database:', err));


let browser = null ;

async function databaseSync(urldata,summarydata)
{



try {
	
	const Urldump = new UrlModel({url:urldata,summary:summarydata})
	await Urldump.save().then(async ()=> {console.log(`url and summary of ${urldata} saved!`)
	}).catch( async (error) =>
		{
		console.log('this error=>'+error)
		})
  
} catch (err) {
  console.error('Error saving URL:', err);
  
  if (err instanceof mongoose.Error.ValidatorError && err.errors.url) {
    console.error('URL already exists in the database.');
  } else {
    console.error('Unexpected error occurred while saving the URL.');
  }
}

}

async function summarizeFromText(textContent,url) {
  try {
	// context length of llama is 4096 and mistral is 32768
	//console.log(`Text content is => ${textContent} \n`)
    const prompt = `Summarize the given content in only 20  words: ${textContent}`;
    const data = {
      model: 'stablelm2',
      prompt: prompt,
      num_ctx: 4096,
      stream: false,
    };
    const output  = await axios.post('http://localhost:11434/api/generate', data)
   //console.log(`\n\nsummary of ${url} is   => ${output.data.response}\n\n`)
    return output.data;
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    return 1;
  }
}

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


    const summary = await summarizeFromText(content,url)
	 //console.log(`\n summary of ${url} => ${summary.response} \n\n`)
   await databaseSync(url,summary.response)


    return { url, summary};
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

const fileterAlreadyIndbUrl = async (urlslist) =>
{

const docs = await UrlModel.find({ url: { $in: urlslist } });

    // Extract the URLs from the documents
    const dbUrls = docs.map((doc) => doc.url);

    // Filter out the URLs that are already in the database using the filter() method
    const newUrls = urlslist.filter((url) => !dbUrls.includes(url));

    // Return the new list of URLs
    //console.log(newUrls);
	return newUrls;


}

const summarize = async (req,res) => {
	const { urls  } =  req.body
	console.log(req.path)
	try 
	{


		const fileteredUrl = await fileterAlreadyIndbUrl(urls);
		//const fileContent = fs.readFileSync('./content.txt', 'utf8');
		if (!browser)
		{
			const browser = await puppeteer.launch();

			//function to filter out already existing urls in db

			const results = await  scrapeWorker(fileteredUrl,browser)

			res.status(200).json(results)
		}
		else 
		{
			const results = await  scrapeWorker(fileteredUrl,browser)
			res.status(200).json(results)
		}
	}
	catch (error) {
		res.status(400).json({ error: error.message })
	}
	
	

}

module.exports = { summarize }
