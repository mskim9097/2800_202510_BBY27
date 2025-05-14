

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
function isAuthorizedExplorer(req, res, next) {
  if (req.session.type === 'explorer') {
    console.log('User is an explorer:', req.session.user);
    next(); 
  } else {
    console.log('invalid user type:', req.session.type);
    res.redirect('/');
  }
}

module.exports = {isAuthorizedExplorer, isAuthorizedResearcher, checkAuthorization};