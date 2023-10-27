if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');

// Security
const joi = require('joi');
const helmet =require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

// Error handling
const wrapAsync = require('./utils/wrapAsync');
const appError = require('./utils/expressError');


const campRoutes = require('./routes/camp.js');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const { campSchema, reviewSchema } = require('./validations/campSchema.js');
const review = require('./models/review');
const campGround = require('./models/campgrounds');
const user = require('./models/users');

const passport = require('passport');
const localStrategy = require('passport-local');


const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/campSite';
// 'mongodb://127.0.0.1:27017/campSite'
mongoose.connect(dbUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Database Connected!')).catch((err) => {
        console.log("Error", err);
    });


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')))

app.use(mongoSanitize());
app.use(helmet());

const store = MongoStore.create({
    mongoUrl:dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto:{
        secret : process.env.SECRET
    }

});

store.on("error", function(e){
    console.log("Session store error", e);
})

const sessionConfig = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: process.env.SECRET,
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 24 * 60 * 60 * 1000,
        maxAge: 24 * 60 * 60 * 1000
    }
}
app.use(session(sessionConfig));
app.use(flash());



const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com"
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://source.unsplash.com",
                "https://res.cloudinary.com/dwpxum7yt/", 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();

})

app.get('/', wrapAsync(async (req, res) => {
    const camps = await campGround.find({})
    res.render('home', { title:"Home" });
}))

// Routing to home page
app.get('/home', wrapAsync(async (req, res) => {
    const camps = await campGround.find({})
    res.render('home');
}))

// basic routes
app.use('/', userRoutes);
app.use('/camps', campRoutes);
app.use('/camps/:id/reviews', reviewRoutes);




app.all('*', (req, res, next) => {
    next(new appError("Not found", 404))
})


// Handling errors
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) {
        err.message = "Something went wrong"
    }
    res.status(status).render('error', { err });

})

const port = process.env.PORT || 8080
// Specifying the port to listen on
app.listen(port, () => {
    console.log('Listening on port 8080!!');
})
