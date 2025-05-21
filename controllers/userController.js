const User = require('../models/userModel');
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
    password: Joi.string().max(20).required(),
    type: Joi.string().valid('researcher', 'explorer').required()
});

//MongoDB connection
// const appClient = require('../databaseConnection').database;

// Authenticates the user by checking the users login credentials.
// If the credentials are valid, it creates a session for the user and saves it to MongoDB.
// If the credentials are invalid, it redirects to the invalid login page.
async function authenticateUser(req, res, next) {
    const { error, value } = loginSchema.validate(req.body);

    if (error) return res.status(400).send("Validation failed.");

    const { email, password } = value;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        console.log(`Authentication failed for ${email}`);
        return res.redirect("/invalid");
    }

    req.session.user = email;
    req.session.userId = user._id.toString();
    req.session.type = user.type;
    req.session.name = user.firstName + " " + user.lastName;

    req.session.save(err => {
        if (err) {
            console.error("Session save error:", err);
            return res.status(500).send("Session error");
        }
        console.log("User type:", user.firstName);
        console.log("User type:", req.session.type);
        console.log("User type:", req.session.userId);
        next();
    });
}

// Checks if the user is authenticated by checking if the session exists.
// If the user is authenticated, it allows the request to proceed.
// If not, it redirects to the login page.
// This middleware is used to protect routes that require authentication.
function authenticated(req, res, next) {
    if (req.session.user) {
        console.log('User is authenticated:', req.session.user);
        console.log('User is authenticated:', req.session.userId);
        console.log('User type in session:', req.session.type);
        next();
    } else {
        console.log('User is not authenticated');
        res.redirect('/');
    }
}

// Destroys the session and clears the session cookie.
// This is typically used when the user logs out.
// After destroying the session, it redirects to the home page.
function destroySession(req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.clearCookie('connect.sid');
        console.log('Session destroyed and cookie cleared.');
        next();
    });
}

async function signUp(req, res, next) {
    try {
        const { firstName, lastName, email, password, type } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with matching fields
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            type,
        });

        const result = await newUser.save();

        // Save user info in session
        req.session.user = email;
        req.session.userId = result._id.toString();
        req.session.type = type;
        req.session.name = `${firstName} ${lastName}`;

        next(); // Or send response here

    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating user.");
    }
}



/*
Authentication middleware for all user types.
*/
function checkAuthorization(req, res, next) {
    if (req.session.type === 'researcher') {
        console.log('User is a researcher:', req.session.user);
        res.redirect('/user/researcher');
    }
    else if (req.session.type === 'explorer') {
        console.log('User is an explorer:', req.session.user);
        res.redirect('/user/explorer');
    } else {
        console.log('invalid user type:', req.session.type);
        res.redirect('/');
    }
}

// These pairs of functions are used to check if the user is authorized as a researcher or explorer.
function isAuthorizedResearcher(req, res, next) {
    if (req.session.type === 'researcher') {
        console.log('User is a researcher:', req.session.user);
        next();
    } else {
        console.log('invalid user type:', req.session.type);
        res.redirect('/');
    }
}

module.exports = { authenticated, destroySession, authenticateUser, signUp, checkAuthorization, isAuthorizedResearcher };