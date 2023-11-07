// VARIABLES
const path = require('path');
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const session = require('express-session');
const dotenv = require('dotenv');
const morgan = require('morgan');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/db');
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs');

// LOAD CONFIG
dotenv.config({ path: './config/.env'});

// PASSPORT CONFIG
require('./config/passport')(passport);

connectDB();

// BODY PARSER
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// METHOD OVERRIDE
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // LOOK IN URLENCODED POST BODIES AND DELETE IT
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

// LOGGING
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// HANDLEBARS
app.engine('.hbs', exphbs.engine(
    { 
        helpers: {
            formatDate,
            truncate,
            stripTags,
            editIcon,
            select,
        },
        defaultLayout: 'main', 
        extname: '.hbs', 
    }
));
app.set('view engine', '.hbs');

// SESSION
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}));

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

// SET GLOBAL VARIABLE
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
    console.log(req.user);
});

// ROUTES
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

// LISTEN SEVER ON PORT
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

