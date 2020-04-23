var path = require("path");

var Constants = require("../utils/Constants");
var Utils = require("../utils/Utils");
var Page = require("./PageApi");
var Workspace = require("./WorkspaceApi");

var UCCopyFile = require("../usecase/file/UCCopyFile");
var UCMoveFile = require("../usecase/file/UCMoveFile");
var UCUploadFile = require("../usecase/file/UCUploadFile");
var UCRenameFile = require("../usecase/file/UCRenameFile");
var UCDeleteFile = require("../usecase/file/UCDeleteFile");

var FileApi = {

    /**
     * 
     * @param {*} req
     * @param {*} res 
     */
    uploadFile: function (req, res) {
        Utils.log(req);

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        var uploadFile = req.files["uploadFile[]"];
        var aFiles = [];
        if (Array.isArray(uploadFile)) {
            aFiles = uploadFile;
        } else {
            aFiles.push(uploadFile);
        }

        var errMsg = UCUploadFile.perform({
            path: req.query.path,
            workspace: req.query.workspace,
            files: aFiles
        });

        if (errMsg) {
            res.status(500).send(errMsg);
        } else {
            res.status(200).send("200");
        }
    },


    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    getFile: function (req, res) {
        Utils.log(req);

        var input = decodeURIComponent(req.path);
        var fullPath = path.join(Constants.WORKSPACE_PATH(req.query.workspace), input.replace("/api/file/", ""));

        if (req.query.download) {
            res.download(fullPath);
        } else {
            res.sendFile(fullPath);
        }
    },

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    renameFile: function (req, res) {
        Utils.log(req);

        UCRenameFile.perform({
            path: req.body.path,
            workspace: req.body.workspace,
            newTitle: req.body.newTitle
        });

        Utils.buildResult(res, JSON.stringify({}));
    },


    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    copyFile: function (req, res) {
        Utils.log(req);

        UCCopyFile.perform({
            workspace: req.body.workspace,
            fileNames: req.body.fileNames,
            src: req.body.src,
            dst: req.body.dst
        });

        Workspace.pageTree(req, res);
    },

    /**
     * 
     * @param {*} req
     * @param {*} res 
     */
    moveFile: function (req, res) {
        Utils.log(req);

        UCMoveFile.perform({
            workspace: req.body.workspace,
            fileNames: req.body.fileNames,
            src: req.body.src,
            dst: req.body.dst
        });

        Workspace.pageTree(req, res);
    },

    /**
     * 
     * @param {*} req
     * @param {*} res 
     */
    deleteFile: function (req, res) {
        Utils.log(req);

        UCDeleteFile.perform({
            path: req.body.path,
            workspace: req.body.workspace,
            fileNames: req.body.fileNames
        });

        Page.loadPage(req, res);
    },


};

module.exports = FileApi;
