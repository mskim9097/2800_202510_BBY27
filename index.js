require("./utils.js");
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const Joi = require("joi");

const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
//setting ejs as the view engine
app.set('view engine', 'ejs');

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;

var {database} = include('databaseConnection');

const userCollection = database.db(mongodb_database).collection('user');

app.use(express.urlencoded({extended: false}));

var mongoStore = MongoStore.create({
	mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
	crypto: {
		secret: mongodb_session_secret
	}
})

app.get('/signupSubmit', async (req, res) => {
    var name = req.query.name;
    var email = req.query.email;
    var password = req.query.password;

    const schema = Joi.object({
        name: Joi.string().alphanum().max(20).required(),
        email: Joi.string().email().max(30).required(),
        password: Joi.string().max(20).required()
    });
    const validationResult = schema.validate({name, email, password});

    if (validationResult.error != null) {
        res.send(`
            Invalid email/password combination.<br><br>
            <a href="/signup">Try again</a>
            `);
    }
    var hashedPassword = await bcrypt.hash(password, saltRounds);

    await userCollection.insertOne({name: name, email: email, password: hashedPassword});

    res.redirect("/");
});

//getting static files from views and public folders
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//Routes from index.js files in the routes folder will be handled here
//We should organize routes in this way.
const indexRouter = require('./routes/index');
app.use('/',indexRouter);

 

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
