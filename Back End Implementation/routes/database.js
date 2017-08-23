/*const mongojs   = require('mongojs');

function initDB() {
    var db = mongojs('punit');
    return db;
};

var dbConnection = initDB();

exports.gDb = dbConnection;   //global db object*/

const mongoose = require('mongoose');

function initDB() {
    var db=mongoose.connect('mongodb://localhost/jewel');
    return db;
};

var dbConnection = initDB();
exports.gDb = dbConnection;