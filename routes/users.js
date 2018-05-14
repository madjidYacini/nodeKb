const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
// user model
const User = require("../models/user");

router.get("/userGet", (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      console.log(err);
    } else {
      res.render("users", { users: users });
    }
  });
});

// register form

router.get('/register',(req,res)=>{
    res.render('register')

})

router.post("/register",(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    
    
req.checkBody("name","Name is required").notEmpty()
req.checkBody("email", "Email must be an email").isEmail();
req.checkBody("email", "Email is required").notEmpty();
req.checkBody("username", "username is required").notEmpty();
req.checkBody("password", "password is required").notEmpty();
req.checkBody("password2", "password2 is required").notEmpty();
req.checkBody("password2", "passwords do not match").equals(password);


 let errors = req.validationErrors();
 if (errors) {
     res.render('register',{errors: errors});

 }else{
    let user = new User({
    name:name,
    username : username ,
    email : email ,
  password : password
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          console.log(err);
        }
        console.log(hash);
        user.password = hash;
        console.log(user.password);

        user.save(err => {
          if (err) {
            console.log(err);
          } else {
            console.log(user.password);
            req.flash("success", "you are now registred , and you can login");
            res.redirect("/users/login");
          }
        });
      });
    });
 }

})

router.get('/login',(req,res)=>{
    res.render("login")
})


router.get('/userGet',(req,res)=>{
    User.find({},(err,users)=>{
        if (err) {
            console.log(err)
        }else{

            res.render("users",{users:users})
        }
    })
})

module.exports=router