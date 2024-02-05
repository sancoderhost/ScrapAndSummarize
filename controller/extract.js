const axios = require('axios');
const cheerio = require('cheerio');

async function extractTextFromWebpage(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let textContent = '';
    $('*').each((i, el) => {
      textContent += $(el).text();
    });

    console.log(textContent);
  } catch (error) {
    console.error(`Error occurred: ${error}`);
  }
}

extractTextFromWebpage('https://santhoughts.netlify.app/post/dreams/');


