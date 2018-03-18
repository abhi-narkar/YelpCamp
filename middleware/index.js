var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");


// All the middleware goes here
var middlewareObj = {};
// middleware to check authorization of campground owner
// checkCampgroundOwnership is a function added to an object- middlewareObj.
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
             Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found!");
                 // back will take the user where it came from.
                res.redirect("back");
            } else{
                  //does user own the campground
                  // .equals is a mongoose special method to check for equal.
                  if(foundCampground.author.id.equals(req.user._id)){
                     next(); 
                  } else{
                      req.flash("error", "You dont have permission to do that");
                      res.redirect("back");
                  }
                 
            }
    });
    } else {
        req.flash("error", "You need to be logged in to do that ");
        // back will take the user where it came from.
       res.redirect("back");
    }
};

// middleware to check authorization of comment owner
// checkCommentOwnership is a function added to an object- middlewareObj.
middlewareObj.checkCommentOwnership = function(req, res, next){
if(req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
             // back will take the user where it came from.
            res.redirect("back");
        } else{
              //does user own the comment ?
              // .equals is a mongoose special method to check for equal.
              if(foundComment.author.id.equals(req.user._id)){
                 next(); 
              } else{
                  req.flash("error", "You dont have permission to do that");
                  res.redirect("back");
              }
             
        }
});
} else {
    // back will take the user where it came from.
    res.flash("error", "You need to be logged in to do that");
   res.redirect("back");
}
};

 // function to check if user is logged in ....
 // isLoggedIn is a function added to an object- middlewareObj.
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    
    // express method 
    req.session.redirectTo = req.originalUrl;
     // flash shows up at the next page, hence must be written before redirecting
    // flash takes key(error/success) and message to display associated with it
    req.flash("error", "You Need To Be Logged In to Do That..");
    res.redirect("/login");
};


module.exports = middlewareObj;