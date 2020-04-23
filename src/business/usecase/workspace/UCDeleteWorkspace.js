var fsExtra = require("fs-extra");
var fs = require("fs");
var path = require("path");
var rimraf = require("rimraf");

var Constants = require("../../utils/Constants");


var UCDeleteWorkspace = {

    /**
     * 
     * @param {*} options 
     */
    perform: function (options) {
        const directoryPath = Constants.PATH;
        var fullPath = path.join(directoryPath, options.title);
        rimraf.sync(fullPath);
    }

};

module.exports = UCDeleteWorkspace;
