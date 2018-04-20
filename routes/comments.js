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

// middlware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;