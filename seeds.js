var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data =[
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1464547323744-4edd0cd0c746?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a2f853d71f43de92c4d568531aa5608f&auto=format&fit=crop&w=500&q=60",
        description: "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
         {
            name: "Desert Mesa",
            image: "https://images.unsplash.com/photo-1510343513665-4527e381af08?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6453907425d52b753f858d980ce8cfe3&auto=format&fit=crop&w=500&q=60",
            description: "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
         },
             {
            name: "Canyon Floor",
            image: "https://images.unsplash.com/photo-1465865523598-a834aac5d3fa?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3c5ad1730ca0862e11d1df3157d99a8f&auto=format&fit=crop&w=500&q=60",
            description: "Tis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            }
    ];

function seedDB(){
    //Remove all campgroundss
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
      console.log("removed campgrounds"); 
          // Add a few Campgrounds
          data.forEach(function(seed){
              Campground.create(seed, function(err, data){
                  if(err){
                      console.log(err);
                  } else{
                      console.log("added a campground");
                      // Create a Comment
                      Comment.create(
                          {
                              text: "This place is great",
                              author: "homer"
                          }, function(err, comment){
                              if(err){
                                  console.log(err);
                              } else {
                                  data.comments.push(comment._id); //'comments' is defined in comment.js
                                  data.save();
                                  console.log("Created New Comment");
                              }
                              
                          });
                       
                  }
              });
          });
    });

    
    //Add a few comments
}

module.exports = seedDB;
