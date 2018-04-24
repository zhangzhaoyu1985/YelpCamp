var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");
var passport    = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash       = require("connect-flash");
var User        = require("./models/user");
var seedDB      = require("./seeds");


// requiring routes
var commentRoutes    = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes      = require("./routes/index");

// Local DB -- development
//mongoose.connect("mongodb://localhost/yelp_camp");

// mLab DB -- production
mongoose.connect("mongodb://neverlandzzy:322118@ds027425.mlab.com:27425/yelpcamp_neverlandzzy");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// __dirname: the directory the script currently running
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to pass currentUser to every route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    // key "error" is set in middleware/index.js
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started!");
});