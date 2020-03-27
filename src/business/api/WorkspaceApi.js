var fs = require("fs");
var path = require("path");
var sharp = require('sharp');
const Constants = require("../utils/Constants");
var hash = require('object-hash');
const pdf = require('pdf-thumbnail');
var Utils = require("../utils/Utils");


var UCWorkspaceTree = require("../usecase/workspace/UCWorkspaceTree");

var NAME = Constants.NAME;
var PATH = Constants.PATH;
var WORKSPACE_PATH = Constants.WORKSPACE_PATH;

var WorkspaceApi = {

  workspaceTree: function (req, res) {
    var directoryStructure = UCWorkspaceTree.perform({ workspace: req.body.workspace });
    Utils.buildResult(res, JSON.stringify({ items: directoryStructure, name: req.body.workspace }));
  },


  listWorkspaces: function (req, res) {

  },

  newWorkspace: function (req, res) {

  }


};

module.exports = WorkspaceApi;
