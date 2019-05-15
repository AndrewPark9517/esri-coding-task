'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
    local: {
        username: {
            type: String,
            required: true,
            unique: true
          },
          password: {
            type: String,
            required: true
          },
          firstName: {type: String, default: ''},
          lastName: {type: String, default: ''}
    },

    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    }
  
});

UserSchema.methods.serialize = function() {
  return {
    _id: this._id,
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.local.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('users', UserSchema);

module.exports = {User};
