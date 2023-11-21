module.exports = {
    ensureAuthenticated: ( req, res, next ) => {
        console.log("ensureAuthenticated req", req.isAuthenticated());
        if ( req.isAuthenticated() ) return next();
        req.flash("error_msg", "Please login to view the page");
        res.redirect("/users/login");
    }
}