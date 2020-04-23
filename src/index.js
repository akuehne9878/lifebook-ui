var express = require('express'),
  app = express(),
  compression = require('compression'),
  open = require('open'),
  serveIndex = require('serve-index'),
  port = process.env.PORT || 8080,
  publicPath = '/app',
  directory = __dirname + publicPath,
  launchUrl = 'http://localhost:' + port + publicPath,
  year = 60 * 60 * 24 * 365 * 1000;


const WorkspaceApi = require("./business/api/WorkspaceApi");
const PageApi = require("./business/api/PageApi");
const FileApi = require("./business/api/FileApi");
const AppApi = require("./business/api/AppApi");
const InvoiceApi = require("./business/api/InvoiceApi");

const fileUpload = require("express-fileupload");
const Constants = require("./business/utils/Constants");


var fs = require("fs");
var path = require("path");


app.use(express.json());
// default options
app.use(fileUpload());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});


// use compress middleware to gzip content
app.use(compression());

// set default mime type to xml for ".library" files
express.static.mime.default_type = "text/xml";

// serve up content directory showing hidden (leading dot) files
app.use('/app/openui5', express.static(__dirname + '/openui5'));
app.use(publicPath, express.static(directory));

// // enable directory listing
// app.use("/", serveIndex(__dirname, { 'icons': true }))



/* Workspace */

app.post("/api/workspace/workspaceTree", WorkspaceApi.workspaceTree);

app.post("/api/workspace/list", WorkspaceApi.listWorkspaces);

app.post("/api/workspace/create", WorkspaceApi.createWorkspace);

app.post("/api/workspace/delete", WorkspaceApi.deleteWorkspace);

app.post("/api/workspace/set", WorkspaceApi.setCurrentWorkspace);

app.post("/api/workspace/get", WorkspaceApi.getCurrentWorkspace);

/* Page */


app.post("/api/page/create", PageApi.createPage);

app.post("/api/page/load", PageApi.loadPage);

app.post("/api/page/save", PageApi.savePage);

app.post("/api/page/delete", PageApi.deletePage);

app.post("/api/page/rename", PageApi.renamePage);

app.post("/api/page/copy", PageApi.copyPage);

app.post("/api/page/move", PageApi.movePage);


/* File */


app.post("/api/file/delete", FileApi.deleteFile);

app.post("/api/file/rename", FileApi.renameFile);

app.post("/api/file/copy", FileApi.copyFile);

app.post("/api/file/move", FileApi.moveFile);

app.post("/upload", FileApi.uploadFile);

// app.route("api/file/upload").post(FileApi.uploadFile)


app.get("/api/file/*", FileApi.getFile);


/* METAINFO */

// app.post("/api/metaInfoTree", Workspace.metaInfoTree);

// app.post("/api/loadMetainfo", Workspace.loadMetainfo);

// app.post("/api/saveMetainfo", Workspace.saveMetainfo);




/* MISC */

// app.get("/api/resize", Workspace.resizeImage);

app.get("/api/app/thumbnail", AppApi.thumbnail);

app.get("/api/app/buildComponentPreload", AppApi.buildComponentPreload);




/* SQLITE */

// app.post("/api/executeStatement", Workspace.executeStatement);

// app.post("/api/listTables", Workspace.listTables);

// app.post("/api/createEntity", Workspace.createEntity);

// app.post("/api/readEntity", Workspace.readEntity);

// app.post("/api/updateEntity", Workspace.updateEntity);

// app.post("/api/deleteEntity", Workspace.deleteEntity); 


app.post("/api/page/:pageid/createInvoice", InvoiceApi.createInvoice);

app.post("/api/page/:pageid/updateInvoice", InvoiceApi.updateInvoice);

app.post("/api/page/:pageid/loadInvoice", InvoiceApi.loadInvoice);



// start server
app.listen(port);

// launch uri in default browser
//open(launchUrl);

// log to server console
console.log("Application server running at\n  => " + launchUrl + " \nCTRL + C to shutdown")



