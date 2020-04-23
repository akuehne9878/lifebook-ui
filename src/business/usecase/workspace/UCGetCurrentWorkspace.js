var fsExtra = require("fs-extra");
var fs = require("fs");
var path = require("path");

var Constants = require("../../utils/Constants");


var UCGetCurrentWorkspace = {

    /**
     * 
     * @param {*} options 
     */
    perform: function (options) {
        var appDir = path.dirname(require.main.filename);
        var appInfo = JSON.parse(fs.readFileSync(path.join(appDir, "appinfo.json"), "utf8"));
        return appInfo.currentWorkspace;
    }

};

module.exports = UCGetCurrentWorkspace;
