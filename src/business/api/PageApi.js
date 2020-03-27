var fs = require("fs");
var fsExtra = require("fs-extra");
var path = require("path");
var rimraf = require("rimraf");
var sharp = require('sharp');
var dateFormat = require('dateformat');
const Constants = require("../utils/Constants");
var hash = require('object-hash');
const pdf = require('pdf-thumbnail');
const ORM = require("../utils/ORM");
const Utils = require("../utils/Utils");
const Workspace = require("./WorkspaceApi");

var WORKSPACE_PATH = Constants.WORKSPACE_PATH;

var UCLoadPage = require("../usecase/page/UCLoadPage");


var PageApi = {

  /**
   * loadPage
   * @param {*} req 
   * @param {*} res 
   */
  loadPage: function (req, res) {

    Utils.log(req);

    req.body.path = req.body.path.split("\\").join("/");

    UCLoadPage.perform({ workspace: req.body.workspace, path: req.body.path }).then(function (data) {
      Utils.buildResult(res, JSON.stringify(data));
    });

  },

  /**
   * savePage
   * @param {*} req 
   * @param {*} res 
   */
  savePage: function (req, res) {
    Utils.log(req);

    var fullIndexPath = path.join(WORKSPACE_PATH, req.body.path, "index.md");
    fs.writeFileSync(fullIndexPath, req.body.content);

    Utils.buildResult(res, JSON.stringify({}));
  },

  /**
   * renamePage
   * @param {*} req 
   * @param {*} res 
   */
  renamePage: function (req, res) {
    Utils.log(req);

    var fullPath = path.join(WORKSPACE_PATH, req.body.path);

    var oldName = fullPath.split(path.sep).pop()
    var newPath = fullPath.replace(oldName, req.body.newTitle);

    var metainfo = JSON.parse(fs.readFileSync(path.join(fullPath, "metainfo.json"), "utf8"));

    ORM.updateEntity(
      {
        name: "page",
        id: ["page_id"],
        properties: [
          { name: "page_id", value: metainfo.pageid },
          { name: "title", value: req.body.newTitle }
        ]
      }).then(function (entity) {
        fsExtra.moveSync(fullPath, newPath);
        Utils.buildResult(res, JSON.stringify(entity));
      })


  },

  /**
   * deletePage
   * @param {*} req 
   * @param {*} res 
   */
  deletePage: function (req, res) {
    Utils.log(req);

    var absolutePath = path.join(WORKSPACE_PATH, req.body.path);

    var metainfo = JSON.parse(fs.readFileSync(path.join(absolutePath, "metainfo.json"), "utf8"));

    ORM.deleteEntity(
      {
        name: "invoice",
        id: ["page_id"],
        properties: [
          { name: "page_id", value: metainfo.pageid },
        ]
      }
    ).then(function (data) {
      return {
        name: "page",
        id: ["page_id"],
        properties: [
          { name: "page_id", value: metainfo.pageid },
        ]
      }
    }).then(function (data) {
      rimraf.sync(absolutePath);
      Workspace.pageTree(req, res);

    });

  },

  /**
   * copyPage
   * @param {*} req 
   * @param {*} res 
   */
  copyPage: function (req, res) {
    Utils.log(req);

    var src = path.join(WORKSPACE_PATH, req.body.src);
    var dst = path.join(WORKSPACE_PATH, req.body.dst, req.body.title);

    fsExtra.copySync(src, dst);

    Workspace.pageTree(req, res);
  },

  /**
   * movePage
   * @param {*} req 
   * @param {*} res 
   */
  movePage: function (req, res) {
    Utils.log(req);

    var src = path.join(WORKSPACE_PATH, req.body.src);
    var dst = path.join(WORKSPACE_PATH, req.body.dst, req.body.title);

    fsExtra.moveSync(src, dst);

    Workspace.pageTree(req, res);
  },

  /**
   * createPage
   * @param {*} req 
   * @param {*} res 
   */
  createPage: function (req, res) {
    Utils.log(req);

    var absolutePath = path.join(WORKSPACE_PATH, req.body.path);

    Page._create(req.body.title, absolutePath, req.body.type, res).then(function (data) {
      Utils.buildResult(res, JSON.stringify(data));
    });

  },

  _create: function (title, sPath, type, res) {
    var fullPath = path.join(sPath, title);
    if (fs.existsSync(fullPath)) {
      res.status(500);
    }

    fs.mkdirSync(fullPath);

    var p = new Promise(function (resolve, reject) {

      ORM.createEntity({
        name: "page",
        properties: [
          { name: "title", value: title },
          { name: "type", value: type }]
      }).then(function (data) {

        var readEntity = {
          name: "page",
          id: ["page_id"],
          properties: [
            { name: "page_id", value: data[0].seq }
          ]
        };
        ORM.readEntity(readEntity).then(function (page) {

          var metainfo = {
            pageid: page.page_id
          };

          fs.writeFileSync(path.join(fullPath, "metainfo.json"), JSON.stringify(metainfo));
          resolve(page);

        });

      })
    });

    return p;

  },

};

module.exports = PageApi;
