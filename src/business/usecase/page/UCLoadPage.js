var fsExtra = require("fs-extra");
var fs = require("fs");
var path = require("path");
const ORM = require("../../utils/ORM");
var dateFormat = require('dateformat');
var sharp = require('sharp');

var Constants = require("../../utils/Constants");


var UCLoadPage = {

    perform: async function perform(options) {

        var workspacePath = Constants.WORKSPACE_PATH(options.workspace);
        var fullPath = path.join(workspacePath, options.path);

        // result structure of load page
        var result = {
            content: "",
            title: "",
            type: "",
            path: "",
            files: [],
            children: [],
            metainfo: JSON.parse(fs.readFileSync(path.join(workspacePath, options.path, "metainfo.json"), "utf8"))
        };

        // content
        var fullIndexPath = path.join(workspacePath, options.path, "index.md");
        if (fs.existsSync(fullIndexPath)) {
            result.content = fs.readFileSync(fullIndexPath) + "";
        }

        // title
        result.title = fullPath.split(path.sep).pop();


        // path
        result.path = fullPath.replace(workspacePath + path.sep, "");

        // type
        var pages = await ORM._run("Select * FROM page where page_id = ?", [result.metainfo.pageid]);
        var page = pages[0];
        result.type = page.type;


        // linked_entity
        if (page.linked_entity) {

            var sql = "SELECT * FROM " + page.linked_entity + " WHERE page_id = ?";
            var values = [result.metainfo.pageid];

            var items = await ORM._run(sql, values);
            if (items && items.length !== 0) {
                var temp = {};
                temp[page.linked_entity] = items[0]
                result.linked_entity = temp;
            }
        }

        // files 
        result.files = this.handleFiles(options);

        // children
        result.children = this.handleChildren(options);

        return Promise.resolve(result);
    },

    handleFiles: function (options) {


        var fullPath = path.join(Constants.WORKSPACE_PATH(options.workspace), options.path);

        var files = [];
        fs.readdirSync(fullPath, { withFileTypes: true }).forEach(function (dirent) {

            var obj = {};

            if (dirent.isFile()) {

                if (dirent.name !== "metainfo.json" && dirent.name !== "index.md") {
                    const stats = fs.statSync(fullPath + path.sep + dirent.name);

                    // var day = dateFormat(stats.birthtime, "dd.mm.yyyy HH:MM");

                    obj.name = dirent.name;
                    obj.date = dirent.day;
                    obj.size = stats.size;

                    obj.type = dirent.name.split(".").pop().toUpperCase();

                    obj.file = "/api/file/" + options.path + "/" + dirent.name + "?workspace=" + options.workspace;

                    // if (dirent.name.toUpperCase().endsWith("JPG")) {
                    //     imageSizePromises.push(new Promise(function (resolve2, reject2) {

                    //         var absolutePath = path.join(workspacePath, options.path, dirent.name);

                    //         var s = sharp(absolutePath);
                    //         s.metadata(function (err, info) {
                    //             if (info) {
                    //                 obj.height = info.height;
                    //                 obj.width = info.width;
                    //             }

                    //             resolve2();
                    //         })
                    //     }));
                    // }

                    if (dirent.name.toUpperCase().endsWith("JPG") || dirent.name.toUpperCase().endsWith("PDF")) {
                        obj.thumbnail = encodeURI("/api/app/thumbnail?path=" + options.path + "&name=" + dirent.name + "&workspace=" + options.workspace);
                    }

                    files.push(obj);
                }
            }
        });
        return files;
    },

    handleChildren: function (options) {
        var fullPath = path.join(Constants.WORKSPACE_PATH(options.workspace), options.path);


        var children = [];
        fs.readdirSync(fullPath, { withFileTypes: true }).forEach(function (dirent) {
            if (dirent.isDirectory()) {
                children.push({ name: dirent.name });
            }
        });
        return children;
    }

};

module.exports = UCLoadPage;
