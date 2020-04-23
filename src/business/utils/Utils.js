
var Utils = {

  log: function (req) {
    console.log("--------------------------------------------------------------------");
    console.log("PATH: \t" + req.path);
    console.log("BODY: \t" + JSON.stringify(req.body));
    console.log("---");
  },

  buildResult: function(res, data, hideLog) {
    var showLog = hideLog === undefined ? true : !hideLog;

    if (showLog) {
      console.log(data);
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(data);
    res.end();
  }

};

module.exports = Utils;
