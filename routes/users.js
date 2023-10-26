const express = require('express');
const router = express.Router();
const user = require('../models/users');
const appError = require('../utils/expressError');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const users = require('../controllers/users');
const { storeReturnTo, isLoggedIn } = require('../middleware');


router.route('/register').get(users.registerForm).post(wrapAsync(users.register))
router.route('/login').get(users.loginForm).post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.makeAccount)
router.get('/logout', isLoggedIn, users.logOut);



module.exports = router;