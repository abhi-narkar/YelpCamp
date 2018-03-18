var express = require("express");
var app = express();
app.set("view engine", "ejs");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

// Requiring Routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/auth");

app.use(flash());
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "He is Arriving",
    resave: false,
    saveUninitialized: false
}));

// All the methods come from passport-local-mongoose plugin installed in user.js
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// function to add currentUser on every route
//whatever put inside res.locals is available inside the template
app.use(function(req, res, next){
     //req.user is a built in method
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
     // if next is not used it will just stop.
    next();
  
});

mongoose.connect("mongodb://localhost/yelp_camp_v8");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method")); // _method is conventional thing used, recommended on method-override documentation. 

// seedDB(); // seed the database


app.use(campgroundRoutes);
app.use(authRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server is Active");
});