const puppeteer = require('puppeteer');
const axios = require('axios');

async function summarizeFromText(textContent) {
  try {

    const prompt = 'Summarize the given  content in 20  words:, output should be in json format with key as author name and value as summary ' + textContent;
    const data = {
      model: 'mistral',
      prompt: prompt,
      format: 'json',
      stream: false,
    };

    let jsondata;
    await axios.post('http://localhost:11434/api/generate', data)
      .then((response) => {
        jsondata = response.data;
      })
      .catch((error) => {
        console.error(`Error occurred: ${error}`);
      });

    return jsondata;
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    return 1;
  }
}
async function scrapeWebPage(url) {
    try{
        const browser = await puppeteer.launch(); // Opens an instance of Chromium or Firefox (depending on your setup) in headless mode 
        const page = await browser.newPage();  

        await page.goto(url); // Replace with the URL you want to scrape

        let content = await page.evaluate(() => document.body.innerText);   

//        console.log(content);  // Prints all textual contents of webpage in terminal  

        browser.close(); // Closes Chromium or Firefox instance after scraping is done
	    return content;
       } catch (error) {
          console.error('Error: ', error);   
      };    
}

async function scrapOut(url)
{
	content = await scrapeWebPage(url);
	summery = await summarizeFromText(content);
	return summery;
}


( async () => 
	{
			//content = await scrapeWebPage('https://en.wikipedia.org/wiki/Raven'); 
			//summery = await summarizeFromText(content);
			let summaries = [];
			  summaries.push(await scrapOut('https://en.wikipedia.org/wiki/Raven'));
			  summaries.push(await scrapOut('https://santhoughts.netlify.app/post/dreams/'));

		summaries.forEach((item, index) => {
			  console.log(`Item at index ${index}: ${item}`);
		});

	}
)();
