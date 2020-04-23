var fsExtra = require("fs-extra");
var fs = require("fs");
var path = require("path");

var Constants = require("../../utils/Constants");


var UCWorkspaceTree = {

    /**
     * 
     * @param {*} options 
     */
    perform: function (options) {

        const walkSync = (dir, item) => {
            const files = fs.readdirSync(dir);
            var children = [];
            for (const file of files) {
                const sPath = path.join(dir, file);
                const dirent = fs.statSync(sPath);

                if (dirent.isDirectory()) {
                    var child = {
                        path: sPath.replace(Constants.WORKSPACE_PATH(options.workspace) + path.sep, "")
                    };
                    child.items = walkSync(sPath, child);
                    children.push(child);
                } else {
                    if (sPath.endsWith("metainfo.json") && item != null) {
                        item.title = path.dirname(sPath).split(path.sep).pop();
                        item.type = "page";
                    }
                }
            }
            return children;
        };



        var directoryStructure = walkSync(Constants.WORKSPACE_PATH(options.workspace));

        var root = {
            title: options.workspace,
            path: "",
            type: "workspace",
            items: directoryStructure,
        }

        return root;
    }

};

module.exports = UCWorkspaceTree;
