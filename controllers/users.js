const user = require('../models/users');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body.user;
        const u = new user({ email, username })
        await user.register(u, password);

        req.login(u, function (err) {
            if (err) {
                return next();

            }
            req.flash('success', 'Welcome to campsite!');
            res.redirect('/home');
        })

    } catch (error) {
        req.flash('error', error.message)
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.makeAccount = (req, res) => {
    req.flash('success', 'Welcome back!');
    const resUrl = res.locals.returnTo || '/camps';
    delete req.session.returnTo;
    res.redirect(resUrl);

}

module.exports.logOut = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', "See you later!")
        res.redirect('/camps');
    });
}
