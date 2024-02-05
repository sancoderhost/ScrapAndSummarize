const mongoose = require('mongoose');
const { UrlModel }  = require('./ModelSchema.js');
const { connect } = require('./Connection.js');

// Connect to the database
connect('mongodb://localhost/Summarydb')
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error('Error connecting to database:', err));

// List of URLs to check
const urls = ['https://github.com/ollama/ollama/issues/1005','https://example.com', 'https://example.org', 'https://santhoughts.netlify.app/post/thoughts/'];

const main = async () => {
  try {
    // Find all documents in the database that have a URL in the list
    const docs = await UrlModel.find({ url: { $in: urls } });

    // Extract the URLs from the documents
    const dbUrls = docs.map((doc) => doc.url);

    // Filter out the URLs that are already in the database using the filter() method
    const newUrls = urls.filter((url) => !dbUrls.includes(url));

    // Return the new list of URLs
    console.log(newUrls);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close().then(() => console.log('Connection closed'));
  }
}

main();

