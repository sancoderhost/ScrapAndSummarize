const express = require('express')
const Routes = require('./routes/routes.js')

const app = express()

// json  parsing 
app.use(express.json())

//Setting up logging
app.use((req,res,next) => {
	console.log(req.path,req.method)
	next()
})

//Routes 

app.use('/api/summarize',Routes)

let PORT=3004;

app.listen(PORT,() => {
	console.log('listening in port',PORT)
})
