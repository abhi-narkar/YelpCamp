var mongoose = require("mongoose");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }, 
        username: String
    },
     comments: [
        {
            //Mongoose objectId belonging to a Comment.
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment" //name of the model
        }
        ]
    
});

module.exports = mongoose.model("Campground", campgroundSchema);
