const axios = require('axios');

async function fetchData(prompt) {
  const apiUrl = 'http://localhost:11434/api/generate';
  const model = 'mistral';
  const data = {
    model,
    prompt,
    stream: false
  };

  try {
    const response = await axios.post(apiUrl, data);
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// First request
fetchData('Why is the sky blue?');
console.log('\nSecond output\n');

// Second request
fetchData('Why is the sky red in the evening?');

