const mongoose = require('mongoose');
const { UrlModel }  = require('./ModelSchema.js');
const { connect } = require('./Connection.js');

// Create a new URL object with the provided data
const Urldump = new UrlModel({url:"http://example7.com",summary:"summary1"})

connect('mongodb://localhost/Summarydb')
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error('Error connecting to database:', err));


const main = async () =>
{
try {
	
/*	await Urldump.save().then(async ()=> {console.log('url saved!')

	urlsdumps = await UrlModel.find()
	console.log(`Url dumps => ${urlsdumps}`)
	}).catch( async (error) =>
		{

		console.log('this error=>'+error)
		urlsdumps = await UrlModel.find()
		console.log(`Url dumps => ${urlsdumps}`)
		})
			*/

// List of URLs to check

// Find all documents in the database that have a URL in the list


	urlsdump = await UrlModel.find()
	console.log(`url  dumps => ${urlsdump}`)
  
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
main().then(()=>{console.log('main executed')})
