var express = require('express');
var fs = require('fs');
var path = require('path');

app = express();

function recursiveRoutes(folderName) {
    fs.readdirSync(folderName).forEach(function(file) {

        var fullName = path.join(folderName, file);
        var stat = fs.lstatSync(fullName);

        if (stat.isDirectory()) {
            recursiveRoutes(fullName);
        } else if (file.toLowerCase().indexOf('.js')) {
            require('./' + fullName)(app);
            console.log("require('" + fullName + "')");
        }
    });
}
recursiveRoutes('controllers');

app.listen(3000, function() {
    //TODO: Bunyan or Winston logging
    console.log('Listening on port 3000...')
});