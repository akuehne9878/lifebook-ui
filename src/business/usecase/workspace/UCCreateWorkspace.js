var fsExtra = require("fs-extra");
var fs = require("fs");
var path = require("path");

var Constants = require("../../utils/Constants");


var UCCreateWorkspace = {

    /**
     * 
     * @param {*} options 
     */
    perform: function (options) {

        const directoryPath = Constants.PATH;

        var fullPath = path.join(directoryPath, options.title);
        if (fs.existsSync(fullPath)) {
            res.status(500);
        }
        fs.mkdirSync(fullPath);

        fs.mkdirSync(path.join(fullPath, Constants.CACHE));
        fs.mkdirSync(path.join(fullPath, Constants.PAGES));
    }

};

module.exports = UCCreateWorkspace;
