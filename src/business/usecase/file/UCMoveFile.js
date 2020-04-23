var fsExtra = require("fs-extra");
var path = require("path");

var Constants = require("../../utils/Constants");

var UCMoveFile = {

    /**
     * 
     * @param {*} options 
     */
    perform: function (options) {
        options.fileNames.forEach(function (fileName) {
            var src = path.join(Constants.WORKSPACE_PATH(options.workspace), options.src, fileName);
            var dst = path.join(Constants.WORKSPACE_PATH(options.workspace), options.dst, fileName);
            fsExtra.moveSync(src, dst);
        })
    }

};

module.exports = UCMoveFile;
