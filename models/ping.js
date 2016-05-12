var moment = require("moment");

exports.get = function(id, cb) {
    cb(null, moment.utc());
};