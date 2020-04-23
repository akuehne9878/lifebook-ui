var fsExtra = require("fs-extra");
var path = require("path");

var Constants = require("../../utils/Constants");

var UCUploadFile = {

    /**
     * 
     * @param {*} options 
     */
    perform: function (options) {
        var sPath = options.path;

        console.log("Upload File: sPath=" + sPath);

        var errMsg = null;
        options.files.forEach(function (file) {

            var absolutePath = path.join(Constants.WORKSPACE_PATH(options.workspace), sPath, file.name)

            console.log("Upload File: filename=" + file.name);
            console.log("Upload File: absolutePath=" + absolutePath);

            // Use the mv() method to place the file somewhere on your server
            file.mv(absolutePath, function (err) {
                if (err) {
                    errMsg += err + "\n";
                }
            });
        })

        return errMsg;
    }

};

module.exports = UCUploadFile;
