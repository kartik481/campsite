const express = require('express');
const router = express.Router({ mergeParams: true });
const review = require('../models/review');
const campGround = require('../models/campgrounds');
const wrapAsync = require('../utils/wrapAsync');
const reviewsCont = require('../controllers/reviews');
const { isLoggedIn, validatereviews, isReview } = require('../middleware');

router.post('/', isLoggedIn, validatereviews, wrapAsync(reviewsCont.postReview));
router.delete('/:reviewId', isLoggedIn, isReview, wrapAsync(reviewsCont.destroyReview));


module.exports = router;