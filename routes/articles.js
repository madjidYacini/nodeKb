const express = require("express");
const router = express.Router();
const Article = require("../models/article");
//add route 
router.get('/add',(req,res)=>{
    res.render("add_article",{
        title : "add articles"
    }) 
})
// add submit post Route
router.post('/add',(req,res)=>{
 req.checkBody("title", "the title is required").notEmpty();
 req.checkBody("author", "the author is required").notEmpty();
 req.checkBody("body", "the body is required").notEmpty();

//  get errors 
 let errors = req.validationErrors();
//  console.log("toooooz", req.body);

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
router.get('/:id',(req,res)=>{
    Article.findById(req.params.id,(err,article)=>{
      res.render("article",{
          article:article
      });  
    })
})
// load edit form
router.get('/edit/:id',(req,res)=>{
    Article.findById(req.params.id,(err,article)=>{
      res.render("edit_article",{
          title:"Edit article",
          article:article
      });
    //   console.log(Article.findById(req.params.id));  
    })
})
// update submit

router.post('/edit/:id',(req,res)=>{
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
           console.log("success")
       req.flash("success", "article updated");
        res.redirect('/')
       }
    })
    // console.log(req.body.title );
})

// delete article 
router.delete('/:id',(req, res)=>{
    let query = {_id :req.params.id}
    Article.remove(query,(err)=>{
        if (err) {
            console.log(err);
            
        }
        res.send('success')
    })
})

module.exports = router