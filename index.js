require("./utils.js");
require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const path = require('path');
const PORT = process.env.PORT || 8000;

//getting static files from views and public folders
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//setting ejs as the view engine
app.set('view engine', 'ejs');

require('dotenv').config();

// MongoDB connection and variables
const MongoStore = require('connect-mongo');
const session = require('express-session');
const mongoSessions = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/biodiversityGo`;

const { database } = require('./databaseConnection');

const { authenticated } = require('./controllers/userController');

// Session Middleware
app.use(session({
  secret: process.env.NODE_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
	mongoUrl: mongoSessions,
	crypto: {
		secret: process.env.MONGODB_SESSION_SECRET
	}
    }),
    cookie: { maxAge: 60 * 60 * 1000 }

}));

// Connect to MongoDB
(async () => {
    try {
        await database.connect();
        console.log("App MongoClient connected");

        // Start server only after DB connection
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1); // stop the app
    }
})();

//Routes from index.js files in the routes folder will be handled here
//We should organize routes in this way.
const indexRouter = require('./routes/indexRoutes');
app.use('/', indexRouter);

const userRouter = require('./routes/userRoutes');
app.use('/user', authenticated, userRouter);

const speciesRouter = require('./routes/speciesRoutes');
app.use('/species', authenticated, speciesRouter);

const questRouter = require('./routes/questRoutes');
app.use('/quests', authenticated, questRouter);

const testRouter = require('./routes/testRoutes');
app.use('/test', testRouter);