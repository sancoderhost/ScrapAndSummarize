const mongoose = require('mongoose');
const { UrlModel }  = require('../model/ModelSchema.js');
const { connect } = require('../model/Connection.js');




const getData  = async (req,res) =>
{
try {
	
await connect('mongodb://localhost/Summarydb')
  .then(async () => {
	console.log(` getData function ${req.path}`)
	urlsdump = await UrlModel.find({})
	console.log(`url  dumps => ${urlsdump}`)
	res.status(200).json(urlsdump)
 

	  console.log('Connected to database')

  })
  .catch((err) =>{ console.error('Error connecting to database:', err)
	
	  res.status(400).json({ error: 'error connecting to databse' })

  });

 
} catch (err) {

	  console.error('Error saving URL:', err);
	  res.status(400).json({ error: err.message })
  
  
}
finally{

mongoose.connection.close().then(()=>{console.log('connection closed!')});
}
}

module.exports = { getData }
