const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("./../models/User");

router.get("/login", ( req, res ) => {
    res.render("login");
});

router.get("/register", ( req, res ) => {
    res.render("register");
});

router.post("/register", ( req, res ) => {
    console.log(req.body);
    const { name, email, password, password2 } = req.body;
    const errors = [];
    if ( !name || !email || !password || !password2 ) errors.push({msg: "Required fields not present"});
    if ( password !== password2 ) errors.push({msg: "Passwords don't match"});
    if ( password.length < 7 ) errors.push({msg: "Password must be atleast 7 characters long"});
    if ( errors.length > 0 ) return res.render("register", {
        errors, 
        name, 
        email, 
        password, 
        password2
    });
    User.findOne({ email }).then(user => {
        if ( user ) {
            errors.push({msg: "User exists. Please login"});
            return res.render("register", {
                errors, 
                name, 
                email, 
                password, 
                password2
            });
        }
        bcrypt.genSalt(10, ( err, salt ) => {
            bcrypt.hash(password, salt, ( err, hashedPwd) => {
                const newUser = new User({
                    name, email, password: hashedPwd
                });
                newUser.save().then(resp2 => {
                    req.flash("success_msg", "Successfully registered");
                    res.redirect("/users/login");
                }).catch(err => {
    
                });
            });
        });
    }).catch(err => {

    });
});

router.post("/login", ( req, res, next ) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard", 
        failureRedirect: "/users/login", 
        failureFlash: true, 
    })( req, res, next );
});

router.get("/logout", ( req, res ) => {
    req.logout(() => {
        req.flash("success_msg", "Successfully logged out");
        res.redirect("/users/login");
    });
});

module.exports = router;
