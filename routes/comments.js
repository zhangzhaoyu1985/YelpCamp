var express  = require("express");
// {mergeParams: true} -- to access :id from app.js
var router   = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//================
//  COMMENT ROUTE
//================

router.get("/new", isLoggedIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// Comments Create
router.post("/", isLoggedIn, function(req, res) {
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect campgrounds show
                    res.redirect("/campgrounds/" +  campground._id);
                }
            });
        }
    });

});

// COMMENT EDIT ROUTE

// since the route is: /campgrounds/:id/comments/:comment_id/edit, if
// we use /:id here, the req.id for comment will overwrite the req.id 
// for campgrounds. So we use a different name, /:comment_id
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
       if (err) {
           res.redirect("back");
       } else {
        // req.params.id : campground id
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
       }
    });
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");     
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next) {
    // if user logged in:
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("/campgrounds");
            } else {
                //  if user owns the comment:
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        // redirect to previous page
        res.redirect("back");
    }
}
module.exports = router;