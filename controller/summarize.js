//Declaring function to summarize
//
const puppeteer = require('puppeteer');
let browser = null ;
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


const summarize = async (req,res) => {
	const { urls  } =  req.body
	console.log(req.path)
	try 
	{
		if (!browser)
		{
			const browser = await puppeteer.launch();
			const results = await  scrapeWorker(urls,browser)
			res.status(200).json(results)
		}
		else 
		{
			const results = await  scrapeWorker(urls,browser)
			res.status(200).json(results)
		}
	}
	catch (error) {
		res.status(400).json({ error: error.message })
	}
	
	

}

module.exports = { summarize }
