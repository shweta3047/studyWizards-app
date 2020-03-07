//just to ckeck pull request........


const express=require('express');

//we need to check urgentlyy......
const app=express();
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const passport=require("passport");
const localStrategy=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");

var user=require("./models/users.js");

mongoose.connect("mongodb://localhost/bot_kill",{useNewUrlParser:true,useUnifiedTopology: true});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

app.use(require("express-session")({
    secret:"its secret",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    next();
});

// ROUTES------------

app.get("/discuss",(req,res)=>{
    res.render("discuss");
})

app.get("/register",(req,res)=>{
    res.render("register");
});
app.post("/register",(req,res)=>{
    var newUser=new user({username:req.body.username,email:req.body.email});
    user.register(newUser,req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            return res.render("register");
        }
        else{
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/discuss");
            })
        }
        
    })
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/discuss",
    failureredirect:"/login"
}),(req,res)=>{
});

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/discuss");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } res.redirect("/login");
}


app.listen("3000",()=>{
    console.log("server is listening!");
});
