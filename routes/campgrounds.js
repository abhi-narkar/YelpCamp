var express = require("express");
// all the routes are saved in router variable, and the routes can be called using the same variable(router.get/router.post) instead of (app.get/app.post) .
var router = express.Router(); 
var Campground = require("../models/campground");
var middleware = require("../middleware");  // all the contents of directory are called, index.js is the main file inside it.

// INDEX ROUTE- show all campgrounds
router.get("/campgrounds", function(req, res){
    //Get all Campgrounds from Database
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
                else{
                     res.render("campgrounds/index", {campgroundsVar: allCampgrounds, currentUser: req.user });
                }
    });
   
});

// CREATE - add a new campground to database
// isLoggedIn is used as a middleware
// isLoggedIn middleware is inside middleware object
router.post("/campgrounds", middleware.isLoggedIn , function(req, res){
     //get data from form and add to campgrounds array
    var name = req.body.name;
    var price =req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    // name,image and description are values taken from "name" in the form tag
    // author is taken from the campgroundSchema.
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    //Create a new Campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
              res.redirect("/campgrounds");
        }
        
    });
     
});
// NEW- Show FORM to create new campground
// isLoggedIn is used as a middleware
// isLoggedIn middleware is inside middleware object
router.get("/campgrounds/new", middleware.isLoggedIn , function(req, res){
    res.render("campgrounds/new");
});

// Show more info about one campground
router.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided id
    //populate comments used because we have created comments array containing object ids in campground.js
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
                console.log(foundCampground);
             //render show template with that campground
             res.render("campgrounds/show", {campgroundVar: foundCampground });
        }
        
    });
});

// EDIT Campground Route
// checkCampgroundownership is used as middleware
// checkCampgroundOwnership middleware is inside middleware object
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership , function(req, res) {
     Campground.findById(req.params.id, function(err, foundCampground){
     res.render("campgrounds/edit", {campgroundVar: foundCampground})
     }); 
});

// Update Campground Route 
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership , function(req, res){
   // find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else{
           res.redirect("/campgrounds/" + updatedCampground._id );
       }
   });
   // redirect somewhere
});

// DESTROY campground route
// checkCampgroundOwnership middleware is inside middleware object
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership , function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
           res.redirect("/campgrounds");  
        } else{
            res.redirect("/campgrounds");
        }
       
    });
});



module.exports = router;