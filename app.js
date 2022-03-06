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
    const title = req.body.title;
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

app.listen(3000, function () {
  console.log("Server lsitening on port 3000");
});
