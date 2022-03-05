const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

const yourDB = 'wikiDB'
const url = `mongodb://localhost:27017/${yourDB}`;
mongoose.connect(url);

const articleSchema = new mongoose.Schema({
    title: {
        type: String
    },
    content: {
        type: String
    }
});

const Article = mongoose.model('Article', articleSchema);

app.get('/', function(req, res) {
    res.send('Hello!');
})


app.listen(3000, function() {
    console.log('Server lsitening on port 3000')
})