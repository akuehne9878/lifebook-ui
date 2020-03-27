sap.ui.define(["jquery.sap.global", "sap/ui/core/BusyIndicator", "sap/ui/model/json/JSONModel", "sap/ui/model/resource/ResourceModel"], function (jquery, BusyIndicator, JSONModel, ResourceModel) {
  return JSONModel.extend("lifebook.model.RestModel", {
    tree: function (data) {
      return this._post("/api/workspace/workspaceTree", data);
    },

    createPage: function (data) {
      return this._post("/api/page/create", data);
    },

    loadPage: function (data) {
      data.path = decodeURIComponent(data.path);
      return this._post("/api/page/load", data);
    },

    savePage: function (data) {
      return this._post("/api/page/save", data);
    },

    deletePage: function (data) {
      return this._post("/api/page/delete", data);
    },

    renamePage: function (data) {
      return this._post("/api/page/rename", data);
    },

    copyPage: function (data) {
      return this._post("/api/page/copy", data);
    },

    movePage: function (data) {
      return this._post("/api/page/move", data);
    },

    deleteFile: function (data) {
      return this._post("/api/file/delete", data);
    },

    renameFile: function (data) {
      return this._post("/api/file/rename", data);
    },

    copyFile: function (data) {
      return this._post("/api/file/copy", data);
    },

    moveFile: function (data) {
      return this._post("/api/file/move", data);
    },

    // executeStatement: function (data) {
    //   return this._post("/api/executeStatement", data);
    // },

    // listTables: function () {
    //   return this._post("/api/listTables");
    // },

    // tableStructure: function (data) {
    //   return this._post("/api/tableStructure", data);
    // },

    // createEntity: function (data) {
    //   return this._post("/api/createEntity", data);
    // },

    // readEntity: function (data) {
    //   return this._post("/api/readEntity", data);
    // },

    // updateEntity: function (data) {
    //   return this._post("/api/updateEntity", data);
    // },

    // deleteEntity: function (data) {
    //   return this._post("/api/deleteEntity", data);
    // },

    createInvoice: function (pageid, data) {
      return this._post("/api/page/" + pageid + "/createInvoice", data);
    },

    updateInvoice: function (pageid, data) {
      return this._post("/api/page/" + pageid + "/updateInvoice", data);
    },

    loadInvoice: function (pageid) {
      return this._post("/api/page/" + pageid + "/loadInvoice");
    },

    _get: function (url) {
      return this._ajax(url, "GET");
    },

    _post: function (url, data) {
      return this._ajax(url, "POST", data);
    },

    _put: function (url) {
      return this._ajax(url, "PUT");
    },

    _delete: function (url) {
      return this._ajax(url, "DELETE");
    },

    _ajax: function (url, method, data) {

      // url = "http://localhost:8080" + url;

      BusyIndicator.show();

      var that = this;
      var promise = new Promise(function (resolve, reject) {
        jquery.ajax({
          url: url,
          method: method,
          dataType: "json",
          data: JSON.stringify(data),
          contentType: "application/json",
          success: function (result) {
            that.setProperty("/", result);
            BusyIndicator.hide();
            resolve(result);
          },
          error: function (err) {
            reject(err);
          },
          timeout: 10000
        });
      });

      return promise;
    }
  });
});
