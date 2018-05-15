const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require("passport");
// user model
const User = require("../models/user");

// router.get("/userGet", (req, res) => {
//   User.find({}, (err, users) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("users", { users: users });
//     }
//   });
// });

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
    
var strongRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
);
const nameRegex = new RegExp ('^[_A-z]*((-|\s)*[_A-z])*$')
    
req.checkBody("name","Name is required").notEmpty();
req.checkBody("name", "Name should have juste letters.").matches(nameRegex);
req.checkBody("email", "Email must be an email").isEmail();
req.checkBody("email", "Email is required").notEmpty();
req.checkBody("username", "username is required").notEmpty();
req.checkBody("password", "password is required").notEmpty();
req.checkBody("password", "password should have at least , one uppercase , lowercase and a number and at least 8 chars ").matches(strongRegex);
req.checkBody("password2", "password2 is required").notEmpty();
req.checkBody("password2", "passwords do not match").equals(password);


 let errors = req.validationErrors();
 if (errors) {
     res.render('register',{errors: errors});

 }else{
   User.find({email : req.body.email})
   .exec()
   .then(user=>{
     if (user.length >= 1) {
      //  console.log("user exists");
       req.flash("danger","user already exists please login");
       res.redirect('/users/login')
     }else{


let user = new User({
  name: name,
  username: username,
  email: email,
  password: password
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
    
 }

})

router.get('/login',(req,res)=>{
    res.render("login")
})
// router.post('/login',(req,res)=>{
//   const email = req.body.email;
//   const password = req.body.password;
//   User.find({email : email})
//   .exec()
//   .then(user=>{
//     if (user.length <1) {
//       req.flash("danger", "user does not exists try again with your valid email");
//       res.redirect("/users/login");
//     }else{
//       bcrypt.compare(req.body.password, user[0].password, (err, result) => {
//         if (err) {
//           console.log(err);
//         } else {
//           req.flash("success", "hello you are connected");
//           res.redirect("/");
//         }
//       });
//     }
//   })

// })


router.post('/login',(req,res,next)=>{
passport.authenticate('local',{
   successRedirect:"/",
    failureRedirect :"/users/login",
    failureFlash : true  
})(req,res,next)
})

// router.get('/userGet',(req,res)=>{
//     User.find({},(err,users)=>{
//         if (err) {
//             console.log(err)
//         }else{

//             res.render("users",{users:users})
//         }
//     })
// })

router.get("/logout",(req,res)=>{
  console.log(req.logout);
  req.logout();
  req.flash('success',"you are logged out");
  res.redirect("/users/login")
})

module.exports=router