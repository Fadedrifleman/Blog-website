//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Hey there! This is a site for my personal blogs, my daily dairy and more";
const aboutContent = "Hey there! This is a site for my personal blogs, my daily dairy and more";
const contactContent = "You can connect with me via email: fadedrifleman@gmail.com";

const app = express();

mongoose.connect("mongodb+srv://admin-shivam:<password>@blogsite.euc3l.mongodb.net/Blog");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {
  title: String,
  content: String
 };

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  })
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});
 
app.get("/posts/:postId", function(req, res){
  const requestedId = req.params.postId;

  Post.findOne({_id: requestedId}, function(err, post){
    res.render("post", { 
      title: post.title,
      content: post.content
    });
  });

});

let port = process.env.PORT;
if(port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started successfully");
});
