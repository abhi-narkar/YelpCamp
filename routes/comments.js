var express = require("express");
// all the routes are saved in router variable, and the routes can be called using the same variable(router.get/router.post) instead of (app.get/app.post) .
var router = express.Router(); 
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");  // all the contents of directory are called, index.js is the main file inside it.

//===================================
// COMMENT ROUTES
//===================================

// isLoggedIn used as middleware to check user is logged in or not to be able to write comment.
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn , function(req, res){
    // Find campground by Id
    Campground.findById(req.params.id, function(err, campgroundId){
        if(err){
            console.log(err);
        } else{
                res.render("comments/new", {campgroundVar: campgroundId});
        }
   });
});

// Comments Create
// isLoggedIn middleware is inside middleware object
router.post("/campgrounds/:id/comments", middleware.isLoggedIn , function(req, res){
    // lookup campground using id
    Campground.findById(req.params.id, function(err, campgroundId){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment, function(err, commentCreate){
                if(err){
                    req.flash("error", "Something Went Wrong!");
                    console.log(err);
                } else{
                    // add username and id to a comment
                    // structure comes from comments model
                    commentCreate.author.id = req.user._id;
                    commentCreate.author.username = req.user.username;
                    // save comment
                    commentCreate.save();
                    campgroundId.comments.push(commentCreate);
                    campgroundId.save();
                    console.log(commentCreate);
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campgroundId._id);
                }
            });
        }
    });
    // create new comment
    // connect a new comment to campground
    // redirect to campgrounds showpage
});

// Comment EDIT route
// checkCommentOwnership middleware is inside middleware object
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment) {
       if(err){
           res.redirect("back");
       } else{
           res.render("comments/edit", {campground_id: req.params.id, commentVar: foundComment});
       }
   });
});

// Comment UPDATE route
// checkCommentOwnership middleware is inside middleware object
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership , function(req, res){
    // findByIdAndUpdate takes 3 params, 1st param to req id, 2nd param for data to update with, 3rd param as callback
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});

// COMMENT Destroy Route
// checkCommentOwnership middleware is inside middleware object
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership , function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Comment Deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;
