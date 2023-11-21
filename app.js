const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const MONGO_URI = require("./config/keys").MongoURI;

mongoose.connect(MONGO_URI).then(resp => {
    console.log("db connected");
}).catch(err => {
    console.log("db error");
});

const PORT = process.env.PORT || 5001;

// Passport config
require("./config/passport")(passport);

const app = express();

app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret', 
    resave: false, 
    saveUninitialized: true, 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(( req, res, next ) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
})
app.set("view engine", "ejs");

app.use("/", require("./routes/index"));

app.use("/users", require("./routes/users"));

app.listen(PORT, () => {
    console.log("Server started and running");
});
