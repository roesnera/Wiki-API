const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');

// initializes express server, sets view engine to ejs so we can use ejs syntax
const app = express();
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// initializes mongodb connection using mongoose driver
const yourDB = "wikiDB";
const url = `mongodb://localhost:27017/${yourDB}`;
mongoose.connect(url, { useNewURLParser: true });

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
});

const Article = mongoose.model("Article", articleSchema);

// Routing for articles path
app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, found) {
      if (!err) {
        res.send(found);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const title = _.lowerCase(req.body.title);
    const content = req.body.content;

    const postArt = new Article({
      title: title,
      content: content,
    });

    postArt.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully added article!");
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted collection contents.");
      }
    });
  });


app.route('/articles/:articleTitle')
  .get(function(req, res){
    const articleTitle = _.lowerCase(req.params.articleTitle);

    Article.findOne({ title: articleTitle }, function(err, found){
      if(err){
        res.send(err);
      } else {
        res.send(found);
      }
    });
  })
  .delete(function(req, res){
    const articleTitle = _.lowerCase(req.params.articleTitle);
    
    Article.findOneAndDelete({ title: articleTitle }, function(err, found){
      if(err){
        res.send(err);
      } else {
        res.send('Successfully deleted entry: '+found);
      };
    })
  })
  .put(function(req, res){
    const articleTitle = _.lowerCase(req.params.articleTitle);

    const putArt = {
      title: _.lowerCase(req.body.title),
      content: req.body.content
    }

    Article.updateOne({ title: articleTitle }, putArt, function(err, found){
      if(err){
        res.send(err);
      } else {
        res.send('Successfully updated entry: '+found);
      };
    })
  })
  .patch(function(req,res){
    const articleTitle = _.lowerCase(req.params.articleTitle);

    const patchArt = req.body;

    console.log(patchArt);
    _.has(req.body, 'title') ? patchArt.title = _.lowerCase(req.body.title) : console.log('Does not have title');

    Article.updateOne({ title: articleTitle }, {$set: patchArt}, function(err, found){
      if(err){
        res.send(err);
      } else {
        res.send('Successfully patched entry: '+found);
      };
    })
  });
  

app.listen(3000, function () {
  console.log("Server lsitening on port 3000");
});
