const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./../models/User");

module.exports = ( passport ) => {
    passport.use(
        new LocalStrategy({
            usernameField: "email"
        }, ( email, password, done ) => {
            // if ( !email ) return done(null, false, { message: "Either email or password don't match" });
            User.findOne({ email }).then( user => {
                console.log("user details", user);
                if ( !user ) return done(null, false, { message: "Either email or password don't match" });
                bcrypt.compare(password, user.password, ( err, isMatch ) => {
                    console.log("user isMatch", isMatch);
                    if ( isMatch ) return done(null, user);
                    return done(null, false, { message: "Either email or password don't match" });
                });
            }).catch( error => {

            });
        })
    );

    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, {
                id: user.id, 
                name: user.name
            });
        });
    });
      
    passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, user);
        });
    });
}
