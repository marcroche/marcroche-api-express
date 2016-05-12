var mongoose = require('mongoose');

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

  mongoose.connect(uri);
  
  var db = mongoose.connection;
  state.db = db;
  state.mode = mode;
  
  db.on('error', console.error.bind(console, 'connection error:'));
  
  db.once('open', function() {
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