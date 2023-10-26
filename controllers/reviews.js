const campGround = require('../models/campgrounds');
const review = require('../models/review');

module.exports.postReview = async (req, res) => {
    const id = req.params.id;
    const r = new review(req.body.review);
    r.owner = req.user._id;
    const camp = await campGround.findById(id);
    camp.reviews.push(r);
    await r.save();
    await camp.save();
    req.flash('success', 'Review saved!');
    res.redirect(`/camps/${camp._id}`);
}

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await campGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted the review');
    res.redirect(`/camps/${id}`)
}
