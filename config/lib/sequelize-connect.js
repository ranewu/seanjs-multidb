"use strict";

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var _ = require('lodash');
var config = require('../config');
var winston = require('./winston');

winston.info('Initializing Sequelize...');

var orm = require('./sequelize');
var orms = {};

var get_discover = function(models){
  var discover = [];
  models.forEach(function(file){
    discover.push(path.resolve(file));
  });
  return discover;
};

orm.discover = get_discover(config.files.server.models);
orm.connect(config.db.name, config.db.username, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: config.db.dialect,
  storage: config.db.storage,
  logging: config.db.enableSequelizeLog ? winston.verbose : false,
  dialectOptions: {
    ssl: config.db.ssl ? config.db.ssl : false
  }
});

for (var db_name in config.files.server.extra_db_models){
  orms[db_name] = require('./sequelize');
  orms[db_name].discover = get_discover(config.files.server.extra_db_models[db_name]);
  orms[db_name].connect(config.extra_dbs[db_name].name, config.extra_dbs[db_name].username, config.extra_dbs[db_name].password, {
    host: config.extra_dbs[db_name].host,
    port: config.extra_dbs[db_name].port,
    dialect: config.extra_dbs[db_name].dialect,
    storage: config.extra_dbs[db_name].storage,
    logging: config.extra_dbs[db_name].enableSequelizeLog ? winston.verbose : false,
    dialectOptions: {
      ssl: config.extra_dbs[db_name].ssl ? config.extra_dbs[db_name].ssl : false
    }
  });
}