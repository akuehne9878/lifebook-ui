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


const Lifebook = require("./api/Lifebook");
const fileUpload = require("express-fileupload");
const Constants = require("./api/Constants");

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


/* Page */

app.get("/api/tree", Lifebook.tree);

app.post("/api/createPage", Lifebook.createPage);

app.post("/api/loadPage", Lifebook.loadPage);

app.post("/api/savePage", Lifebook.savePage);

app.post("/api/deletePage", Lifebook.deletePage);

app.post("/api/renamePage", Lifebook.renamePage);

app.post("/api/copyPage", Lifebook.copyPage);

app.post("/api/movePage", Lifebook.movePage);


/* File */


app.post("/api/deleteFile", Lifebook.deleteFile);

app.post("/api/renameFile", Lifebook.renameFile);

app.post("/api/copyFile", Lifebook.copyFile);

app.post("/api/moveFile", Lifebook.moveFile);

app.post("*/upload", Lifebook.uploadFile);

app.get("/api/file/*", Lifebook.getFile);


/* METAINFO */

app.post("/api/metaInfoTree", Lifebook.metaInfoTree);

app.post("/api/loadMetainfo", Lifebook.loadMetainfo);

app.post("/api/saveMetainfo", Lifebook.saveMetainfo);




/* MISC */

app.get("/api/resize", Lifebook.resizeImage);

app.get("/api/thumbnail", Lifebook.thumbnail);



/* SQLITE */

app.post("/api/executeStatement", Lifebook.executeStatement);

app.post("/api/listTables", Lifebook.listTables);

app.post("/api/createEntity", Lifebook.createEntity);

app.post("/api/readEntity", Lifebook.readEntity);

app.post("/api/updateEntity", Lifebook.updateEntity);

app.post("/api/deleteEntity", Lifebook.deleteEntity);

app.post("/api/page/:pageid/createInvoice", Lifebook.createInvoice);

app.post("/api/page/:pageid/updateInvoice", Lifebook.updateInvoice);

app.post("/api/page/:pageid/loadInvoice", Lifebook.loadInvoice);


// function sendFile(fileName, res) {
//   if (fs.existsSync(fileName)) {
//     res.sendFile(fileName, function (err) {
//       if (err) throw err;
//       console.log("File sent:", fileName);
//     });
//   } else {
//     res.status(404).send("Not found");
//     console.log("Not found:", fileName);
//   }
// }


// app.get("/" + Constants.NAME + "/*", function (req, res) {
//   sendFile(path.join(Constants.PATH, decodeURIComponent(req.path)), res);
// });



// start server
app.listen(port);

// launch uri in default browser
//open(launchUrl);

// log to server console
console.log("Application server running at\n  => " + launchUrl + " \nCTRL + C to shutdown")



