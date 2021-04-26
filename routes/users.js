const express = require("express");
const router = express.Router();
const bcrypt =require('bcryptjs');
const passport=require('passport');
//user model

const User = require("../models/User");

//   login
router.get("/login", (req, res) => res.render("login"));

//   register
router.get("/register", (req, res) => res.render("register"));
router.get("/dashboard", (req, res) => res.render("dashboard"));
// RegisterHandle

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];
  //check require field
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill all field" });
  }
  // check password match
  if (password != password2) {
    errors.push({ msg: "passwords do not match" });
  }
  if (password.length < 6) {
    errors.push({ msg: "passworrd should be 5 character long" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // valadition pass
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //user exists
        errors.push({ msg: "Email is already registered " });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      }else{
       
const newUser =new User({
    name,
    email,
    password
});

//hash passworrd
bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newUser.password,salt,(err,hash)=>{
  if(err)throw err;

  newUser.password=hash;
  //save user
  newUser.save()
  .then(user=>{
      req.flash('success_msg','You are now registered and can login');
      res.redirect('/users/login')
  })
}))
      }
    });
  }
});

// login handle
router.post('/login',(req,res,next)=>{
passport.authenticate('local',{
    successRedirect:'/dashboard',
    failureRedirect:'/users/login',
    failureFlash:true
})(req,res,next);
});



// logout handle

router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success_msg','you are successfully logged out');
    res.redirect('/users/login');
})

module.exports = router;
