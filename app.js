var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
    {name: "Salmon Creek", image: "https://farm2.staticflickr.com/1086/882244782_d067df2717.jpg"},
    {name: "Granite Hill", image: "https://farm8.staticflickr.com/7268/7121859753_e7f787dc42.jpg"},
    {name: "Mountain Goat's Rest", image: "https://pixabay.com/get/e837b50928f0043ed1584d05fb1d4e97e07ee3d21cac104497f3c579a4ebb3bf_340.jpg"},
];

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});

// REST naming convention - same route but different method, GET and POST
app.post("/campgrounds", function(req, res) {
    // get data from from and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
    // redirect back to campgrounds page
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started!");
});