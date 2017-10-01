'use strict';

// NPM dependencies.
var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    sequelize = require('sequelize'),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    path = require('path'),
    cors = require('cors'),
    multer = require('multer');
var defConst = require('./const/defaultConst'),
    UsefulProgram = require('./programs/usefulProgram');

// App related modules.
var hookJWTStrategy = require('./services/passportStrategy');

// Initializations.
var app = express();

//Handle CORS
app.use(cors());

// Parse as urlencoded and json.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Parse multipart/form-data for upload project
// app.use(multer({
//     storage: multer.diskStorage({
//         destination: defConst.uploadProject,
//         limits: {fileSize: 1000000, files: 1}
//     })
// }).single('project_file'))

//Parse multipart/form-data for upload design
// app.use(multer({
//     storage: multer.diskStorage({
//         destination: defConst.uploadDesign,
//         limits: {fileSize: 1000000, files: 1}
//     })
// }).single('design_file'))

// Hook up the HTTP logger.
app.use(morgan('dev'));

// Hook up Passport.
app.use(passport.initialize());

// Hook the passport JWT strategy.
hookJWTStrategy(passport);

// Set the static files location.
app.use(express.static(__dirname + '/../public'));

// Bundle API routes.
app.use('/api', require('./routes/api')(passport));

// Catch all route.
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/../public/app/views/index.html'));
});

// Start the server.
app.listen('7777', function() {
    console.log('Magic happens at http://agrihack.party:7777/! We are now all now doomed!');
});
