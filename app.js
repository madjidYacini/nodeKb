const express = require("express");
const path = require("path");
const mongoose = require ("mongoose");
 const bodyParser= require("body-parser"); 
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
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save((err)=>{
       if(err){
        console.log(err);
        return;
       }else{
        res.redirect('/')
       }
    })
    // console.log(req.body.title );
})

// get single article
app.get('/article/:id',(req,res)=>{
    Article.findById(req.params.id,(err,article)=>{
      res.render("article",{
          article:article
      });  
    })
})
// load edit form
app.get('/article/edit/:id',(req,res)=>{
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