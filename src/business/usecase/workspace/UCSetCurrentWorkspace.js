var fsExtra = require("fs-extra");
var fs = require("fs");
var path = require("path");

var Constants = require("../../utils/Constants");


var UCSetCurrentWorkspace = {

    /**
     * 
     * @param {*} options 
     */
    perform: function (options) {
        var appDir = path.dirname(require.main.filename);
        var appInfo = {
            currentWorkspace: options.title
        };
        fs.writeFileSync(path.join(appDir, "appinfo.json"), JSON.stringify(appInfo));
    }

};

module.exports = UCSetCurrentWorkspace;
