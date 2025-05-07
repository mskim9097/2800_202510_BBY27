require("./utils.js");
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const Joi = require("joi");
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

var { database } = include('databaseConnection');

const userCollection = database.db(mongodb_database).collection('user');
const speciesCollection = database.db(mongodb_database).collection('species');

app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

var mongoStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
  crypto: {
    secret: mongodb_session_secret
  }
});

app.use(session({
  secret: node_session_secret,
  saveUninitialized: false,
  resave: false,
  store: mongoStore,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

// Species routes
app.get("/species", async (req, res) => {
  const speciesList = await speciesCollection.find().toArray();
  res.render("pages/species", { species: speciesList });
});

app.get("/add-species", isAuthenticated, (req, res) => {
  res.render("add-species");
});

app.post("/add-species", async (req, res) => {
  const newSpecies = {
    commonName: req.body.commonName,
    scientificName: req.body.scientificName,
    image: req.body.image,
    description: req.body.description,
    location: {
      center: {
        lat: parseFloat(req.body.lat),
        lng: parseFloat(req.body.lng)
      },
      rangeKm: parseFloat(req.body.rangeKm)
    }
  };
  await speciesCollection.insertOne(newSpecies);
  res.redirect("/species");
});

// Create user route
app.post('/createUser', async (req, res) => {
  var { firstName, lastName, email, password, type } = req.body;

  const schema = Joi.object({
    firstName: Joi.string().alphanum().max(20).required(),
    lastName: Joi.string().alphanum().max(20).required(),
    email: Joi.string().email().max(30).required(),
    password: Joi.string().max(20).required()
  });

  const validationResult = schema.validate({ firstName, lastName, email, password });

  /*
  if (validationResult.error != null) {
      res.send(\`
          Invalid email/password combination.<br><br>
          <a href="/signup">Try again</a>
          \`);
      return;
  }*/

  var hashedPassword = await bcrypt.hash(password, saltRounds);
  await userCollection.insertOne({ firstName, lastName, email, password: hashedPassword, type });

  res.redirect("/");
});

// Use index router for root routes
const indexRouter = require('./routes/index');
app.use('/',indexRouter);


 

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));