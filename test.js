const axios = require('axios');
const cheerio = require('cheerio');

async function getAnswer( question) {
  const response = await axios.post('http://localhost:11434/api/generate', {
    model: 'mistral',
    prompt: `Why is the sky color is ${question}?`,
    stream: false,
  });

  return response.data;
}

async function summarizeFromUrl(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
        $("script").remove();   // Remove script tags from HTML content
        $("style").remove();    // Remove style tags from HTML content
        const textContent  = $('body').text().trim();     

        const prompt = 'Summarize the given essay in 30 words:, output should be in json format with key as author name and value as summary ' + textContent;
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


(async () => {
  try {
//	const blueSkyAnswer = await getAnswer('why color of sky is blue');  
	//const summery = await summarizeFromUrl('https://santhoughts.netlify.app/post/dreams/');

	//console.log(summery);

//	console.log('First output:', blueSkyAnswer);
 //       const redSkyAnswer = await getAnswer('why sky appears red in the evening');
  //  	console.log('Second output:', redSkyAnswer);
	const summery2 = await summarizeFromUrl('https://en.wikipedia.org/wiki/Raven');
	console.log(summery2);


  } catch (error) {
    console.error(error);
  }
})();

