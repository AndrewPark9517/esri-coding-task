'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/esri-coding-task';
exports.PORT = process.env.PORT || 8080;
exports.FacebookAuth = {
    ClientID : 1020707808317498,
    ClientSecret : 'a38739242769654a90505d66c62dfb53',
    callbackURL : "localhost://8080/api/auth/facebook/callback"
};