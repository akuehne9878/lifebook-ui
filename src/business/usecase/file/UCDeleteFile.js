var path = require("path");
var rimraf = require("rimraf");

var Constants = require("../../utils/Constants");

var UCDeleteFile = {

    /**
     * 
     * @param {*} options 
     */
    perform: function (options) {
        options.fileNames.forEach(function (fileName) {
            var absolutePath = path.join(Constants.WORKSPACE_PATH(options.workspace), options.path, fileName);
            rimraf.sync(absolutePath);
        });
    }

};

module.exports = UCDeleteFile;
