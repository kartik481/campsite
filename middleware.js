const { campSchema, reviewSchema } = require('./validations/campSchema.js');
const appError = require('./utils/expressError');
const campGround = require('./models/campgrounds');
const review = require('./models/review.js');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You need to login!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = function (req, res, next) {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCamps = function (req, res, next) {
    const result = campSchema.validate(req.body);
    //console.log(result)
    if (result.error) {
        const message = result.error.details.map(msg => msg.message).join(',');
        throw new appError(message, 400)
    }
    else {
        next();
    }
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const camp = await campGround.findById(id);
    if (!camp.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to update!');
        return res.redirect(`/camps/${id}`)
    }
    next();
}

module.exports.isReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const r = await review.findById(reviewId);
    if (!r.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to Delete!');
        return res.redirect(`/camps/${id}`)
    }
    next();
}


module.exports.validatereviews = function (req, res, next) {
    const result = reviewSchema.validate(req.body);
    //console.log(result)
    if (result.error) {
        const message = result.error.details.map(msg => msg.message).join(',');
        throw new appError(message, 400)
    }
    else {
        next();
    }
}

