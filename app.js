const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const app= express();
const passport = require('passport');
 

//pass port config
require('./config/passport')(passport);
// DB config
const db = require('./config/keys').MongoURI; 


// connect to mongo db

mongoose.connect(db, { useNewUrlParser:true,useUnifiedTopology: true })
.then(()=>console.log('MongoDb connected...'))
.catch(err=>console.log(err));


//ejs
app.use(expressLayouts);
//app.set('layout', './layout')
app.set('view engine','ejs');

//Bodyparser
app.use(express.urlencoded({extended:false}));

// Express Session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());



// connect flash

app.use(flash());

//global var
app.use((req,res,next)=>{
   res.locals.success_msg=req.flash('success_msg'); 
   res.locals.error_msg=req.flash('error_msg');
   res.locals.error=req.flash('error');
   next() ;
   
}); 

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT||5000;

app.listen(PORT,console.log(`Server started at port ${PORT} `));