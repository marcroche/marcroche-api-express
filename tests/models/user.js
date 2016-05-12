var should = require('should');
var db = require('../../db');
var fixtures = require('../fixtures/test-data');

//var Comment = require('../../models/comment')

describe('Model User Tests', function() {

  before(function(done) {
    db.connect(db.MODE_TEST, done)
  })

  beforeEach(function(done) {
    db.drop(function(err) {
      if (err) return done(err)
      db.fixtures(fixtures, done)
    })
  })

  it('all', function(done) {
    Comment.all(function(err, comments) {
      comments.length.should.eql(3)
      done()
    })
  })

  it('create', function(done) {
    Comment.create('Famous Person', 'I am so famous!', function(err, id) {
      Comment.all(function(err, comments) {
        comments.length.should.eql(4)
        comments[3]._id.should.eql(id)
        comments[3].user.should.eql('Famous Person')
        comments[3].text.should.eql('I am so famous!')
        done()
      })
    })
  })

  it('remove', function(done) {
    Comment.all(function(err, comments) {
      Comment.remove(comments[0]._id, function(err) {
        Comment.all(function(err, result) {
          result.length.should.eql(2)
          result[0]._id.should.not.eql(comments[0]._id)
          result[1]._id.should.not.eql(comments[0]._id)
          done()
        })
      })
    })
  })
})