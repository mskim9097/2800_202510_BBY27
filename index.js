require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override');

app.use(methodOverride('_method'));

require('./utils.js');

const PORT = process.env.PORT || 8000;

// MongoDB connection URI
const mongoURI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/biodiversityGo?retryWrites=true&w=majority`;

// Static files and view engine
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Session middleware with Mongoose-based store
app.use(
  session({
    secret: process.env.NODE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoURI,
      crypto: { secret: process.env.MONGODB_SESSION_SECRET },
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 hour
  })
);

// AI Generated middleware
// Middleware to make session data available to templates
app.use((req, res, next) => {
  if (req.session) {
    res.locals.name = req.session.name;
    res.locals.userType = req.session.type;
    // You can add other session variables here if needed
  }
  next();
});

// Connect to MongoDB with Mongoose and start server
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Mongoose connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' Mongoose connection error:', err);
    process.exit(1);
  });

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Route protection middleware
const { authenticated } = require('./controllers/userController');

// Routes
const indexRouter = require('./routes/indexRoutes');

app.use('/', indexRouter);

const userRouter = require('./routes/userRoutes');

app.use('/user', authenticated, userRouter);

const questRouter = require('./routes/questRoutes');

app.use('/quests', authenticated, questRouter);

const aiRouter = require('./routes/aiRoutes');

app.use('/ai', aiRouter);

// Optional routes
const speciesRouter = require('./routes/speciesRoutes');

app.use('/species', authenticated, speciesRouter);

// const testRouter = require('./routes/testRoutes');
// app.use('/test', testRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('pages/404', { title: 'Page Not Found' });
});
