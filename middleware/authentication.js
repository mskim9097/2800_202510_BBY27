
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 12;
const Joi = require("joi");

const loginSchema = Joi.object({
    email: Joi.string().min(4).max(40).required(),
    password: Joi.string().min(6).max(25).required()
});
const schema = Joi.object({
    firstName: Joi.string().alphanum().max(20).required(),
    lastName: Joi.string().alphanum().max(20).required(),
    email: Joi.string().email().max(30).required(),
    password: Joi.string().max(20).required()
});

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

// not sure if I can edit the session like this
// router.use(session({
//     secret: process.env.NODE_SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: sessionStore,
//     cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
// }));

// Needs to be connected to the login Schema(JOI), once we have this the username 
// and password will be used to validate the user
// This code is partially from assignment 1 of Web Dev 2, but I also
// had chatGPT make it more related to this project as middleware
// async function authenticateUser(req, res, next) {
//     const { error, value } = loginSchema.validate(req.body);
//     if (error) {
//         console.warn('Validation failed:', error.details);
//         return res.status(400).send('Invalid input');
//     }

//     const { email, password } = value;

//     try {
//         const result = await appClient.db("biodiversityGo").collection("user").findOne({ email });
//         console.log(result);
//         if (!result) {
//             console.log(`User ${email} not found.`);
//             return res.redirect('/invalid');
//         }

//         const match = await bcrypt.compare(password, result.password);
//         if (!match) {
//             console.log(`Password mismatch for ${email}`);
//             return res.redirect('/invalid');
//         }

//         console.log(`Authenticated ${email}`);
//         req.email = result;
//         createSession(req, res, next);
//     } catch (err) {
//         console.error("DB Error:", err);
//         res.status(500).send("Internal error");
//     }
// }

async function authenticateUser(req, res, next) {
    const { error, value } = loginSchema.validate(req.body);

    if (error) return res.status(400).send("Validation failed.");

    const { email, password } = value;
    const user = await appClient.db('biodiversityGo').collection("user").findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        console.log(`Authentication failed for ${email}`);
        return res.redirect("/invalid");
    }

    req.session.user = { email: user.email };
    req.session.save(err => {
        if (err) return res.status(500).send("Session error");
        console.log("Session saved:", req.session);
        next();
    });
}


function createSession(req, res, next) {
    req.session.email = req.body.email;
    req.session.save((err) => {
        if (err) {
            console.error('Error saving session:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Session created:', req.session.email);
        next();
    });
}

function authenticated(req, res, next) {
    if (req.session.user) {
        console.log('User is authenticated:', req.session.user);
        next();
    } else {
        console.log('User is not authenticated');
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
async function signUp(req, res, next) {
    // const { firstName, lastName, email, password } = req.body;
    // const validationResult = schema.validate({ firstName, lastName, email, password });

    // if (validationResult.error) {
    //     console.warn('Validation failed:', validationResult.error.details);
    //     return res.status(400).send('Invalid input');
    // }

    // bcrypt.hash(password, 12, async (err, hashedPassword) => {
    //     if (err) {
    //         console.error('Hashing error:', err);
    //         return res.status(500).send('Internal Server Error');
    //     }

    //     await appClient.db("biodiversityGo").collection("user").insertOne({
    //         firstName,
    //         lastName,
    //         email,
    //         password: hashedPassword
    //     });

    //     next();
    // });
    const { firstName, lastName, email, password } = req.body;

    if (email && password && email) {
        try {
            console.log("Connected to MongoDB");

            hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword
            };

            const result = await appClient.db('biodiversityGo').collection("user").insertOne(newUser);
            console.log(`New user created with the following id: ${result.insertedId}`);

            req.session.user = email;
        } catch (err) {
            console.error("Error creating user:", err);
            res.status(500).send('Internal Server Error');
        } finally {
            next();
        }
    } else {
        console.log('Username, password, or email not provided.');
        res.redirect('/');
    }
}

module.exports = { authenticated, destroySession, createSession, authenticateUser, signUp };