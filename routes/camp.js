if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
const express = require('express');
const router = express.Router();
const { campSchema } = require('../validations/campSchema.js');
const campGround = require('../models/campgrounds');
const wrapAsync = require('../utils/wrapAsync');
const appError = require('../utils/expressError');
const passport = require('passport');
const camps = require('../controllers/camp');
const { isLoggedIn, validateCamps, isOwner } = require('../middleware.js');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage: storage });

router.route('/').get(wrapAsync(camps.index)).post(isLoggedIn, upload.array('image'), validateCamps, wrapAsync(camps.makeCamp))
router.get('/makecamp', isLoggedIn, wrapAsync(camps.viewMakeCamp));
router.route('/:id').get(isLoggedIn, wrapAsync(camps.showCamp)).put(isLoggedIn, upload.array('image'), validateCamps, isOwner, wrapAsync(camps.updateCamp)).delete(isLoggedIn, isOwner, wrapAsync(camps.destroyCamp));
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(camps.editCamp));
router.route('/search').post(isLoggedIn, wrapAsync(camps.Search))

module.exports = router;