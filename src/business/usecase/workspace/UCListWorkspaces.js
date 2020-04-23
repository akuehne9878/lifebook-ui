var fsExtra = require("fs-extra");
var fs = require("fs");
var path = require("path");

var Constants = require("../../utils/Constants");


var UCListWorkspaces = {

    /**
     * 
     * @param {*} options 
     */
    perform: function (options) {

        var result = [];

        const directoryPath = Constants.PATH;


        const files = fs.readdirSync(directoryPath);
        for (const file of files) {
            const sPath = path.join(directoryPath, file);
            const dirent = fs.statSync(sPath);

            if (dirent.isDirectory()) {
                result.push({ title: file });
            }
        }

        return result;
    }

};

module.exports = UCListWorkspaces;
