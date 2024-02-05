const axios = require('axios');
const cheerio = require('cheerio');

async function getWebPageContent() {
    try{
        const response = await axios.get('https://en.wikipedia.org/wiki/Raven'); // Replace with the URL you want to scrape

        let $ = cheerio.load(response.data); 

        $("script").remove();   // Remove script tags from HTML content
        $("style").remove();    // Remove style tags from HTML content

        const text = $('body').text().trim();     

        console.log(text);  // Prints all human-readable textual contents of webpage in terminal  
       } catch (error) {
          console.error('Error: ', error);   
       };    
}
getWebPageContent();
