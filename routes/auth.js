var express = require("express");
// all the routes are saved in router variable, and the routes can be called using the same variable(router.get/router.post) instead of (app.get/app.post) .
var router = express.Router(); 
var passport = require("passport");
var User = require("../models/user");


// Root Route
router.get("/", function(req, res){
    res.render("landing");
});

//=====================
// AUTH ROUTES
//=====================

// show register form
router.get("/register", function(req, res) {
    res.render("register");
});

// Handle sign up logic
router.post("/register", function(req, res) {
    // method .register provided by passport-local-mongoose.
    //password is not stored in database, it is given as second argument in .register method
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, userdata){
        if(err){
            
            // req.flash("error", err.message);
            console.log(err);
            return res.render("register", {error: err.message});
        } 
        // to login user
        passport.authenticate("local")(req, res, function(){ 
            req.flash("success", "Welcome to YelpCamp " + userdata.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    // flash message will appear only after when user is not logged in
    // The flash msg code is written in isLoggedIn middleware
    res.render("login"); 
});

// Handling login logic
// passport.authenticate is second parameter used as a middleware.
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureredirect: "/login",
    failureFlash: "User Name or Password incorrect!",
     successFlash: "Welcome",
}), function(req, res) {
    });


 
// LOGOUT logic route
router.get("/logout", function(req, res) {
    // built in method
   req.logout(); 
   // flash message will appear on next page where it is redirected
   req.flash("success", "Logged you out");
   res.redirect("/campgrounds");
});


module.exports = router;