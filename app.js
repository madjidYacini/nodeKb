const express = require("express");
const path = require("path");
const mongoose = require ("mongoose");
const bodyParser= require("body-parser"); 
const session = require("express-session");
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const articles = require("./routes/articles");
const users = require("./routes/users");
const config = require("./config/database")
const passport = require("passport")
// connction to mongodb

mongoose.connect(config.database);
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
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);
// passport config
require('./config/passport')(passport)
 app.use(passport.initialize());
 app.use(passport.session());
// route files
app.get('*',(req,res,next)=>{
  res.locals.user=req.user || null;
  next();
  // console.log(req.user)
})

app.use("/articles", articles);
app.use("/users",users);

// home route
app.get('/',(req,res)=>{
 Article.find({},(err, articles)=>{
     if (err) {
         console.log(err);
     }else{
    res.render("index", { title: "Articles", articles: articles });
    // console.log("object");

 }})
    
})


// start server

app.listen(3000,()=>{
    console.log("listing on 3000");
})
// start server
