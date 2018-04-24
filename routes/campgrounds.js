var express  = require("express");
var router   = express.Router();
var Campground = require("../models/campground");
// if just put directory name, it will automatically require the file named 'index.js'
var middleware = require("../middleware");

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
router.post("/", middleware.isLoggedIn, function(req, res) {
    // get data from from and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username,
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    
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
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// [RESTFUL] SHOW - show more info about one campground
// id: match any string 
router.get("/:id", function(req, res) {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    //Campground.findById(req.params.id, function(err, foundCampground) {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            console.log(err);
            res.redirect("back");
        } else {
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            res.redirect("back");
            console.log(err);
        }
        res.render("campgrounds/edit", {campground:foundCampground}); 
    });
});
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
       if (err) {
           res.redirect("/campgrounds");
           console.log(err);
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
    // redirect to show page
});

// DESTORY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
       if (err) {
           res.redirect("/campgrounds");
           console.log(err);
       } 
       res.redirect("/campgrounds");
    });
});

module.exports = router;