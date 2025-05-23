const bcrypt = require('bcrypt');

const Joi = require('joi');
const User = require('../models/userModel');

const loginSchema = Joi.object({
  email: Joi.string().min(4).max(40).required(),
  password: Joi.string().min(6).max(25).required(),
});

// Authenticates the user by checking the users login credentials.
// If the credentials are valid, it creates a session for the user and saves it to MongoDB.
// If the credentials are invalid, it redirects to the invalid login page.
async function authenticateUser(req, res) {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return res.render('pages/login', {
        error: `Invalid input: ${error.details[0].message}`,
        email: req.body.email,
      });
    }

    const { email, password } = value;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('pages/login', {
        error: 'Invalid email or password',
        email,
      });
    }

    req.session.user = email;
    req.session.userId = user._id.toString();
    req.session.type = user.type;
    req.session.name = `${user.firstName} ${user.lastName}`;

    await req.session.save();
    res.redirect('/user');
  } catch (error) {
    console.error('Authentication error:', error);
    res.render('pages/login', {
      error: 'An error occurred during login. Please try again.',
      email: req.body.email,
    });
  }
}

// Checks if the user is authenticated by checking if the session exists.
// If the user is authenticated, it allows the request to proceed.
// If not, it redirects to the login page.
// This middleware is used to protect routes that require authentication.
function authenticated(req, res, next) {
  if (!req.session.user) {
    return res.render('pages/login', {
      error: 'Please log in to access this page',
    });
  }
  next();
}

// Destroys the session and clears the session cookie.
// This is typically used when the user logs out.
// After destroying the session, it redirects to the home page.
function destroySession(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.render('pages/error', {
        error: 'An error occurred while logging out. Please try again.',
      });
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
}

async function signUp(req, res) {
  try {
    const { firstName, lastName, email, password, type } = req.body;

    if (!firstName || !lastName || !email || !password || !type) {
      return res.render('pages/signup', {
        error: 'All fields are required',
        formData: { firstName, lastName, email, type },
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('pages/signup', {
        error: 'This email is already registered',
        formData: { firstName, lastName, type },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      type,
    });

    await newUser.save();
    res.redirect('/login?success=Account created successfully');
  } catch (error) {
    console.error('Signup error:', error);
    res.render('pages/signup', {
      error: 'An error occurred during signup. Please try again.',
      formData: req.body,
    });
  }
}

/*
Authentication middleware for all user types.
*/
function checkAuthorization(req, res) {
  try {
    if (!req.session.type) {
      return res.render('pages/login', {
        error: 'Please log in to access this page',
      });
    }

    if (req.session.type === 'researcher') {
      res.redirect('/user/researcher');
    } else if (req.session.type === 'explorer') {
      res.redirect('/user/explorer');
    } else {
      res.render('pages/login', {
        error: 'Invalid user type. Please log in again.',
      });
    }
  } catch (error) {
    console.error('Authorization error:', error);
    res.render('pages/login', {
      error: 'An error occurred. Please try again.',
    });
  }
}

// These pairs of functions are used to check if the user is authorized as a researcher or explorer.
function isAuthorizedResearcher(req, res, next) {
  if (req.session.type !== 'researcher') {
    return res.render('pages/error', {
      error: 'You must be a researcher to access this page',
      userType: req.session.type,
      name: req.session.name,
    });
  }
  next();
}

function isAuthorizedExplorer(req, res, next) {
  if (req.session.type !== 'explorer') {
    return res.render('pages/error', {
      error: 'You must be an explorer to access this page',
      userType: req.session.type,
      name: req.session.name,
    });
  }
  next();
}

module.exports = {
  authenticated,
  destroySession,
  authenticateUser,
  signUp,
  checkAuthorization,
  isAuthorizedResearcher,
  isAuthorizedExplorer,
};
