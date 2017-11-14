"use strict";

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var config = require('../config');
var winston = require('./winston');

winston.info('Initializing Sequelize...');

var orms = {};

var get_discover = function(models){
  var discover = [];
  models.forEach(function(file){
    discover.push(path.resolve(file));
  });
  return discover;
}; 

for (var db_name in config.files.server.models){
  orms[db_name] = require('./sequelize')();
  orms[db_name].discover = get_discover(config.files.server.models[db_name]);
  orms[db_name].config = config.db[db_name];
  orms[db_name].connect(config.db[db_name].name, config.db[db_name].username, config.db[db_name].password, {
    host: config.db[db_name].host,
    port: config.db[db_name].port,
    dialect: config.db[db_name].dialect,
    storage: config.db[db_name].storage,
    logging: config.db[db_name].enableSequelizeLog ? winston.verbose : false,
    dialectOptions: {
      ssl: config.db[db_name].ssl ? config.db[db_name].ssl : false
    }
  });
}

module.exports = orms;