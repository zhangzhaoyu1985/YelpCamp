var express  = require("express");
var router   = express.Router();
var Campground = require("../models/campground");

// [RESTFUL] INDEX - show all campgrounds
router.get("/", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// REST naming convention - same route but different method, GET and POST
// [RESTFUL] CREATE - add new campground to DB
router.post("/", function(req, res) {
    // get data from from and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    
    // Create a new campround and save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console(err);
        } else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// [RESTFUL] NEW - show form to create new campground
router.get("/new", function(req, res) {
    res.render("campgrounds/new");
});

// [RESTFUL] SHOW - show more info about one campground
// id: match any string 
router.get("/:id", function(req, res) {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    //Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
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