const express = require("express");
const path = require("path");
const mongoose = require ("mongoose");
const bodyParser= require("body-parser"); 
const session = require("express-session");
const expressValidator = require('express-validator');
const flash = require('connect-flash');

// connction to mongodb

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

// check connection
db.once('open', ()=>{
    console.log("connected to mongo db ")
})
// check for db errors
db.on('error', (err)=>{
    console.log(error)
})

//init app
const app = express();

// bring in model 
const Article = require('./models/article')

//calling article route 
// const articles = require('./routes/articles');
// app.use('/articles',articles)
// body parser middleWare
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// set a public folder 
app.use(express.static(path.join(__dirname,'public')));

// load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//express session middleWare 

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
   
  })
);
// express messages 
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// express validator midlleware
app.use(expressValidator({
    errorFormatter: function (param,msg,value) {
        var namespace =param.split('.')
        ,root = namespace.shift()
        ,formParam = root;
        while (namespace.length) {
            formParam+='['+namespace.shift()+']';
        }
        return{
            param : formParam,
            msg : msg ,
            value :value
        }
    }
}))
// home route
app.get('/',(req,res)=>{
 Article.find({},(err, articles)=>{
     if (err) {
         console.log(err);
     }else{
    res.render("index", { title: "Articles", articles: articles });

 }})
    
})
//add route 
app.get('/articles/add',(req,res)=>{
    res.render("add_article",{
        title : "add articles"
    }) 
})
// add submit post Route
app.post('/articles/add',(req,res)=>{
 req.checkBody("title", "the title is required").notEmpty();
 req.checkBody("author", "the author is required").notEmpty();
 req.checkBody("body", "the body is required").notEmpty();

 let errors = req.validationErrors();
 console.log("toooooz", req.body);

 if (errors) {
   res.render("add_article", { title: "add articles", errors: errors });
 } else {
   let article = new Article();
   article.title = req.body.title;
   article.author = req.body.author;
   article.body = req.body.body;

   article.save(err => {
     if (err) {
       console.log(err);
       return;
     } else {
       req.flash("success", "article added");
       res.redirect("/");
     }
   });
 }
    // console.log(req.body.title );
})

// get single article
app.get('/articles/:id',(req,res)=>{
    Article.findById(req.params.id,(err,article)=>{
      res.render("article",{
          article:article
      });  
    })
})
// load edit form
app.get('/articles/edit/:id',(req,res)=>{
    Article.findById(req.params.id,(err,article)=>{
      res.render("edit_article",{
          title:"Edit article",
          article:article
      });  
    })
})
// update submit

app.post('/articles/edit/:id',(req,res)=>{
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    let query ={_id :req.params.id}
    Article.update(query,article,(err)=>{
       if(err){
        console.log(err);
        return;
       }else{
       req.flash("success", "article updated");
        res.redirect('/')
       }
    })
    // console.log(req.body.title );
})

// delete article 
app.delete('/article/:id',(req, res)=>{
    let query = {_id :req.params.id}
    Article.remove(query,(err)=>{
        if (err) {
            console.log(err);
            
        }
        res.send('success')
    })
})
// start server

app.listen(3000,()=>{
    console.log("listing on 3000");
})
// start server
