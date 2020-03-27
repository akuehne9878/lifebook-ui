var fsExtra = require("fs-extra");
var path = require("path");

var Constants = require("../../utils/Constants");

var UCRenameFile = {

    /**
     * 
     * @param {*} options 
     */
    perform: function (options) {
        var fullPath = path.join(Constants.WORKSPACE_PATH, options.path);

        var oldName = fullPath.split(path.sep).pop()
        var newPath = fullPath.replace(oldName, options.newTitle);

        fsExtra.moveSync(fullPath, newPath);
    }

};

module.exports = UCRenameFile;
