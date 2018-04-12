var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create( 
//     {
//         name: "Granite Hill", 
//         image: "https://farm8.staticflickr.com/7268/7121859753_e7f787dc42.jpg",
//         description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!",
    
//     }, function(err, campground) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATED CAMPGROUND: ");
//             console.log(campground);
//         }
//     });

app.get("/", function(req, res) {
    res.render("landing");
});

// [RESTFUL] INDEX - show all campgrounds
app.get("/campgrounds", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

// REST naming convention - same route but different method, GET and POST
// [RESTFUL] CREATE - add new campground to DB
app.post("/campgrounds", function(req, res) {
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
app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

// [RESTFUL] SHOW - show more info about one campground
// id: match any string 
app.get("/campgrounds/:id", function(req, res) {
    // find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });

});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started!");
});