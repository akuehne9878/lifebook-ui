var fs = require("fs");
var path = require("path");
var ORM = require("../../utils/ORM");

var UCCreatePage = {

    perform: async function perform(options) {
        var fullPath = path.join(options.path, options.title);
        if (fs.existsSync(fullPath)) {
            res.status(500);
        }
        fs.mkdirSync(fullPath);

        var createdResult = await ORM.createEntity({
            name: "page",
            properties: [
                { name: "title", value: options.title },
                { name: "type", value: options.type }]
        });

        var readEntity = {
            name: "page",
            id: ["page_id"],
            properties: [
                { name: "page_id", value: createdResult[0].seq }
            ]
        };

        var page = await ORM.readEntity(readEntity);
        var metainfo = {
            pageid: page.page_id
        };
        fs.writeFileSync(path.join(fullPath, "metainfo.json"), JSON.stringify(metainfo));
      
        return Promise.resolve(page);
    }
    
};

module.exports = UCCreatePage;
