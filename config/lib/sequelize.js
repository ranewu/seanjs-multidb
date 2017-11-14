"use strict";

var
  path = require('path'),
  Sequelize = require('sequelize'),
  winston = require('./winston');

module.exports = function(){

  var db = {};

  db.Sequelize = Sequelize;
  db.models = {};
  db.discover = [];
  db.config = {};

  // Expose the connection function
  db.connect = function(database, username, password, options) {

    if (typeof db.logger === 'function')
      winston.info("Connecting to: " + database + " as: " + username);

    // Instantiate a new sequelize instance
    var sequelize = new db.Sequelize(database, username, password, options);


    db.discover.forEach(function(location) {
      var model = sequelize["import"](location);
      if (model)
        db.models[model.name] = model;
    });

    // Execute the associate methods for each Model
    Object.keys(db.models).forEach(function(modelName) {
      if (db.models[modelName].options.hasOwnProperty('associate')) {
        db.models[modelName].options.associate(db.models);
        winston.info("Associating Model: " + modelName);
      }
    });

    if (db.config.sync) {
      // Synchronizing any model changes with database.
      sequelize.sync()
        .then(function() {
          winston.info("Database synchronized");
        }).catch(function(err) {
          winston.error("An error occured: %j", err);
        });
    }

    db.sequelize = sequelize;

    winston.info("Finished Connecting to Database");

    return true;
  };

  return db;
};
// module.exports = db;