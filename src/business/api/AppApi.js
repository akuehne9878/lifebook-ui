var fs = require("fs");
var path = require("path");
var rimraf = require("rimraf");
var sharp = require('sharp');
const Constants = require("../utils/Constants");
var hash = require('object-hash');
const pdf = require('pdf-thumbnail');

var AppApi = {

  thumbnail: function (req, res) {
    var absolutePath = path.join(Constants.WORKSPACE_PATH(req.query.workspace), req.query.path, req.query.name);
    absolutePath = absolutePath.split("\\").join("/");

    var cachedFilePath = path.join(Constants.WORKSPACE_CACHE_PATH(req.query.workspace) , hash(absolutePath) + ".jpg");

    try {
      if (fs.existsSync(cachedFilePath)) {
        res.sendFile(cachedFilePath);
      } else {
        if (req.query.name.toUpperCase().endsWith("JPG")) {
          sharp(absolutePath)
            .rotate()
            .resize({ height: 300, width: 300 })
            .toFile(cachedFilePath, function (err) {
              if (err) {
                res.sendStatus(500);
                return;
              }
              res.sendFile(cachedFilePath);
            });
        } else {
          const pdfBuffer = require('fs').readFileSync(absolutePath);
          pdf(pdfBuffer, {
            compress: {
              type: 'JPEG',  //default
              quality: 100    //default
            },
            crop: {
              width: 300,
              height: 300,
              x: 10,
              y: 10,
              ratio: true
            }
          })
            .then(function (data) {
              data.pipe(fs.createWriteStream(cachedFilePath));
              res.sendFile(cachedFilePath)
            })
            .catch(err => console.error(err))
        }

      }
    } catch (err) {
      console.error(err)
    }

  },


  buildComponentPreload: function (req, res) {

    const options = {
      html: {
        removeAttributeQuotes: false,
      },
      css: {
        compatibility: '*',
      },
      js: {
        ecma: 5,
      },
      img: {
        maxSize: 4096,
      }
    }


    var preload = { modules: {} };

    var prefix = "lifebook";
    var base = "/home/pi/lifebook-ui/src/app";

    var aExcludeList = ["/lib", "/css", "/index.html", "/Component-preload.js"];


    var walkSync = function (dir, filelist) {
      var files = fs.readdirSync(dir);
      filelist = filelist || [];
      files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
          filelist = walkSync(path.join(dir, file), filelist);
        }
        else {
          var filePath = path.join(dir, file);
          var bAddFile = true;

          aExcludeList.forEach(function (excludeItem) {
            if (filePath.startsWith(base + excludeItem)) {
              bAddFile = false;
            }
          });
          if (bAddFile) {
            filelist.push({ fullFilePath: filePath, preloadPath: filePath.replace(base, prefix) });
          }
        }
      });
      return filelist;
    };

    var result = "sap.ui.require.preload({";

    var filelist = walkSync(base);
    filelist.forEach(function (obj) {


      result += "\n\"" + obj.preloadPath + "\":";


      var fileContent = fs.readFileSync(obj.fullFilePath).toString();

      if (obj.preloadPath.endsWith("js")) {
        result += "function() {" + fileContent + "},";
      } else if (obj.preloadPath.endsWith("json")) {
        result += "'" + JSON.stringify(fileContent) + "',";
      } else if (obj.preloadPath.endsWith("xml")) {
        fileContent = fileContent.replace(/(?:\r\n|\r|\n)/g, "\\n");
        fileContent = fileContent.replace(/(')/g, "\\'");


        result += "'" + fileContent + "',";
      } else if (obj.preloadPath.endsWith("properties")) {
        fileContent = fileContent.replace(/(?:\r\n|\r|\n)/g, "\\n");
        result += "'" + fileContent + "',";
      }

    })


    result = result.slice(0, -1); // remove last ","
    result += "\n});";



    res.writeHead(200, { "Content-Type": "text/js" });
    res.write(result);
    res.end();

    fs.writeFileSync(base + "/Component-preload.js", result);
  }



};

module.exports = AppApi;
