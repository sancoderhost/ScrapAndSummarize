
const express = require('express')

//For setting up routes

const router = express.Router()

const { summarize } = require('../controller/summarize.js')
const { getData } = require('../controller/getData.js')
router.post('/',summarize)
router.get('/getData',getData)
module.exports=router



