var Ping = require('../model/ping')

module.exports = function(app) {
    app.get('/ping', function(req, res) {   
        Ping.get(null, function(err, time) {
            res.send(time);    
        });
    });
}