const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({
    sub: user.id,
    iat: timestamp
  }, config.secret);
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(422).send({error: 'email and password required'});
  }

  User.findOne({email: email}, function(err, existingUser) {
    console.log(existingUser);
    if (err) return next(err);

    if (existingUser) {
      return res.status(422).send({error: 'email in use'});
    } else {
      const user = new User({
        email: email,
        password: password
      });

      user.save(function(err) {
        if (err) return next(err);
        return res.json({token: tokenForUser(user)});
      });
    }
  });
};

exports.signin = function(req, res, next) {
  console.log(req.user);
  // User already authed, return token
  return res.send({token: tokenForUser(req.user)});
}
