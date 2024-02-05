//Mongo db schema
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  summary: { type: Object, required: true }
});

const   UrlModel = mongoose.model('UrlDump', urlSchema);
module.exports  = { UrlModel  } 
