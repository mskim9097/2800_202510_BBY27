
require('dotenv').config();
const express = require('express');
const router = express.Router();

//MongoDB connection
const MongoStore = require('connect-mongo');
const mongoUri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
const appClient = require('../databaseConnection').database;

const { MongoClient } = require('mongodb');

// Session store MongoClient
const sessionStore = MongoStore.create({
    mongoUrl: mongoUri,
    crypto: {
        secret: process.env.MONGODB_SESSION_SECRET
    }
});

const session = require('express-session');
// not sure if I can edit the session like this
session({
    secret: process.env.NODE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
});

// Needs to be connected to the login Schema(JOI), once we have this the username 
// and password will be used to validate the user
async function authenticateUser(req, res, next) {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
        console.warn('Validation failed:', error.details);
        return res.status(400).send('Invalid input');
    }

    const { email, password } = value;

    if (email && password) {
        console.log(`Received sign in request for user ${email}`);
        try {
            const result = await appClient.db("biodiversityGo").collection("user").findOne({ email: email });

            if (result) {
                console.log(`User ${email} found in database.`);
                const match = await bcrypt.compare(password, result.password);

                if (match) {
                    console.log(`Password for user ${email} is correct.`);
                    req.session.user = email;
                    res.redirect('/members');
                } else {
                    console.log(`Incorrect password for user ${email}.`);

                    res.redirect('/invalid');
                }
            } else {
                console.log(`User ${email} not found in database.`);
                res.redirect('/invalid');
            }
        } catch (err) {
            console.error("Error connecting to MongoDB:", err);
        }
        finally {
            // Close the connection
            console.log("Connection closed");
        }
    }
}


function createSession(req, res, next) {
    req.session.user = req.body.user;
    req.session.save((err) => {
        if (err) {
            console.error('Error saving session:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Session created:', req.session.user);
        next();
    });
}

function authenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

function destroySession(req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.clearCookie('connect.sid');
        console.log('Session destroyed and cookie cleared.');
        res.redirect('/');
    });
}

module.exports = { authenticated, destroySession, createSession, authenticateUser };