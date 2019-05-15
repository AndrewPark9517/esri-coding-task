'use strict';
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const { FacebookAuth } = require('../config');

const { User } = require('../users/model');

const localStrategy = new LocalStrategy((username, password, callback) => {
  let user;
  console.log('username: ', username);
  console.log('password: ', password);
  User.findOne({ 'local.username' : username })
    .then(_user => {
      user = _user;
      console.log('user: ', user);
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return callback(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});

const facebookStrategy = new FacebookStrategy({
  clientID: FacebookAuth.ClientID,
  clientSecret: FacebookAuth.ClientSecret,
  callbackURL: FacebookAuth.callbackURL
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    User.findOne({'facebook.id': profile.id}, function(err, user) {
      if(err) {
        return done(err);
      }
      if(user) {
        return done(null, user);
      }
      else {
        let newUser = new User();
        newUser.facebook.id = profile.id;
        newUser.facebook.email = profile.emails[0].value;
        newUser.facebook.name = profile.name.givenName 
          + ' ' + profile.name.familyName;
        newUser.facebook.token = accessToken;

        newUser.save(err => {
          if(err) return err;
          return done(null, newUser);
        });
      }
    })
  }) 
  
});

module.exports = { localStrategy, facebookStrategy };
