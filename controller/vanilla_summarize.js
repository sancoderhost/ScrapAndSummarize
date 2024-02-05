const axios = require('axios');
const cheerio = require('cheerio');

async function postllm(promptData)
{
	try
	{
		const data = {
		model: 'mistral',
		prompt: promptData,
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
	}
	catch(error)
	{
		console.error(`Error occurred: ${error}`);
		return 1;
	}

}

async function summarizeFromUrl(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let textContent = '';
    $('*').each((i, el) => {
      textContent += $(el).text();
    });

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

  //const summery = await summarizeFromUrl('https://santhoughts.netlify.app/post/dreams/');
  //console.log(summery);
  const output = await  postllm('why sky in evening is redish give me response as in json format with key as question asked and value as answer');
  console.log('second output =>'+ output.toString());

})();

