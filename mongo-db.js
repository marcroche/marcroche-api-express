var MongoClient = require('mongodb').MongoClient;
var async = require('async');

var state = {
  db: null,
  mode: null
};

// TODO: Environment variables
var PRODUCTION_URI = 'mongodb://localhost/marcroche-api-express';
var TEST_URI = 'mongodb://localhost/marcroche-api-express-test';

exports.MODE_TEST = 'mode_test';
exports.MODE_PRODUCTION = 'mode_production';

exports.connect = function(mode, done) {
  if (state.db) return done();

  var uri = mode === exports.MODE_TEST ? TEST_URI : PRODUCTION_URI;

  MongoClient.connect(uri, function(err, db) {
    if (err) return done(err);
    state.db = db;
    state.mode = mode;
    done();
  });
};

exports.getDB = function() {
  return state.db;
};

exports.drop = function(done) {
  if (!state.db) return done();
  // This is faster then dropping the database
  state.db.collections(function(err, collections) {
    async.each(collections, function(collection, cb) {
      if (collection.collectionName.indexOf('system') === 0) {
        return cb();
      }
      collection.remove(cb);
    }, done);
  });
};

exports.fixtures = function(data, done) {
  var db = state.db;
  if (!db) {
    return done(new Error('Missing database connection.'));
  }

  var names = Object.keys(data.collections);
  async.each(name, function(name, cb) {
    db.createCollection(name, function(err, collection) {
      if (err) return cb(err);
      collection.insert(data.collections[name], cb);
    })
  }, done);
};