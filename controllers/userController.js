require('dotenv').config();
const express = require('express');
const Joi = require("joi");
const MongoStore = require('connect-mongo');
const session = require('express-session');
const bcrypt = require("bcrypt");
const saltRounds = 12;
const expireTime = 24 * 60 * 60 * 1000;
const app = express();

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

app.use(session({ 
    secret: node_session_secret,
    store: mongoStore, //default is memory store 
    saveUninitialized: false, 
    resave: true
}
));

//logic related to common routes like login... goes here
// sign up function.
const createUser = async (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var type = req.body.userType;

    const schema = Joi.object({
        firstName: Joi.string().alphanum().max(20).required(),
        lastName: Joi.string().alphanum().max(20).required(),
        email: Joi.string().email().max(30).required(),
        password: Joi.string().max(20).required()
    });
    const validationResult = schema.validate({firstName, lastName, email, password});
    /*
    if (validationResult.error != null) {
        res.send(`
            Invalid email/password combination.<br><br>
            <a href="/signup">Try again</a>
            `);
        return;
    }*/
    var hashedPassword = await bcrypt.hash(password, saltRounds);

    await userCollection.insertOne({firstName: firstName, lastName: lastName, email: email, password: hashedPassword, type: type});

    res.redirect("/");
}


module.exports = {createUser};