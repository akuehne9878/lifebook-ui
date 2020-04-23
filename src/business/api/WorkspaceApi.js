var fs = require("fs");
var path = require("path");
var sharp = require('sharp');
const Constants = require("../utils/Constants");
var hash = require('object-hash');
const pdf = require('pdf-thumbnail');
var Utils = require("../utils/Utils");


var UCWorkspaceTree = require("../usecase/workspace/UCWorkspaceTree");
var UCListWorkspaces = require("../usecase/workspace/UCListWorkspaces");
var UCCreateWorkspace = require("../usecase/workspace/UCCreateWorkspace");
var UCDeleteWorkspace = require("../usecase/workspace/UCDeleteWorkspace");
var UCSetCurrentWorkspace = require("../usecase/workspace/UCSetCurrentWorkspace");
var UCGetCurrentWorkspace = require("../usecase/workspace/UCGetCurrentWorkspace");

var WorkspaceApi = {

  workspaceTree: function (req, res) {
    var root = UCWorkspaceTree.perform({ workspace: req.body.workspace });
    Utils.buildResult(res, JSON.stringify({ items: [root] }), true);
  },


  listWorkspaces: function (req, res) {
    Utils.buildResult(res, JSON.stringify({ items: UCListWorkspaces.perform() }))
  },

  createWorkspace: function (req, res) {
    UCCreateWorkspace.perform({ title: req.body.title });
    Utils.buildResult(res, JSON.stringify({}));
  },

  deleteWorkspace: function (req, res) {
    UCDeleteWorkspace.perform({ title: req.body.title });
    Utils.buildResult(res, JSON.stringify({}));
  },

  setCurrentWorkspace: function (req, res) {
    UCSetCurrentWorkspace.perform({ title: req.body.title });
    Utils.buildResult(res, JSON.stringify({ title: req.body.title }));
  },

  getCurrentWorkspace: function (req, res) {
    var currentWorkspace = UCGetCurrentWorkspace.perform();
    Utils.buildResult(res, JSON.stringify({ currentWorkspace: currentWorkspace }));
  },



};

module.exports = WorkspaceApi;
