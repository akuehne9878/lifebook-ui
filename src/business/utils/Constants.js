var path = require("path");

var Constants = {
  PATH: path.join("/home", "pi", "lifebook-data"),
  CACHE: "cache",
  PAGES: "pages",
  DB: "db"
};

Constants.WORKSPACE_PATH = function (workspace) {

  Constants.WORKSPACE_DB_PATH = path.join(Constants.PATH, workspace, Constants.DB);

  return path.join(Constants.PATH, workspace, Constants.PAGES)
};

Constants.WORKSPACE_CACHE_PATH = function (workspace) {
  return path.join(Constants.PATH, workspace, Constants.CACHE)
};

module.exports = Constants;
