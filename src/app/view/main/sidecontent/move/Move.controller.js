sap.ui.define(
  [
    "lifebook/view/main/sidecontent/BaseSideContentController.controller",
    "lifebook/model/RestModel",
    "jquery.sap.global",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/core/mvc/Controller",
    "sap/base/Log"
  ],
  function (BaseSideContentController, RestModel, jQuery, MessageBox, JSONModel, MessageToast, Fragment, Controller, Log) {
    return BaseSideContentController.extend("lifebook.view.main.sidecontent.move.Move", {
      onInit: function (oEvent) {
        this.getOwnerComponent().registerController(this);
      },

      setup: function (oOptions) {
        this.setModel(new JSONModel(oOptions), "options")
        this.setModel(new JSONModel({}), "currTarget");

        if (oOptions.preSelectedPath) {
          this.getModel("currTarget").setProperty("/path", oOptions.preSelectedPath);
          this.getModel("currTarget").setProperty("/title", oOptions.preSelectedPath);
          this._expandTreeItem(oOptions.preSelectedPath);
        }

      },

      onPress: function (oEvent) {
        var oBindingContext = oEvent.getSource().getBindingContext("targetTree");

        var oObj = oBindingContext.getObject();
        this.getModel("currTarget").setProperty("/path", oObj.path);
        this.getModel("currTarget").setProperty("/title", oObj.title);

      },

      onShowNewPage: function(oEvent) {
        var dstPath = this.getModel("currTarget").getProperty("/path");
        this.getController("lifebook.view.main.Main")._loadSideContent("lifebook.view.main.sidecontent.new.New", "Neue Seite", {parentPath: dstPath, caller: this.getView().getViewName()})
      },

      onSave: function (oEvent) {
        if (this.getModel("options").getProperty("/mode") === "page") {
          this._onSavePage(oEvent);
        } else {
          this._onSaveAttachment(oEvent);
        }
      },

      _onSavePage: function (oEvent) {
        var oRestModel = new RestModel();

        var workspace = this.getOwnerComponent().getWorkspace();
        var srcPath = this.getModel("currPage").getProperty("/path");
        var dstPath = this.getModel("currTarget").getProperty("/path");
        var title = this.getModel("currPage").getProperty("/title");

        var that = this;
        oRestModel.movePage({ workspace: workspace, src: srcPath, dst: dstPath, title: title }).then(function (data) {
          that.getController("lifebook.view.main.master.Master").reloadPage(srcPath, { reloadTree: true });
          that.getModel("mdsPage").setProperty("/showSideContent", false);
        });
      },

      _onSaveAttachment: function (oEvent) {
        var oRestModel = new RestModel();

        var workspace = this.getOwnerComponent().getWorkspace();
        var srcPath = this.getModel("currPage").getProperty("/path");
        var dstPath = this.getModel("currTarget").getProperty("/path");


        var arr = this.getOwnerComponent().getModel("selectedAttachments").getData();
        if (arr === {}) {
          arr = [];
          arr.push(this.getOwnerComponent().getModel("currAttachment").getProperty("/"));
        };

        var fileNames = arr.map(function (item) {
          return item.name;
        })

        var that = this;
        oRestModel.moveFile({ workspace: workspace, src: srcPath, dst: dstPath, fileNames: fileNames }).then(function (data) {
          that.getController("lifebook.view.main.detail.AbstractPage").reloadPage(srcPath);
          that.getModel("mdsPage").setProperty("/showSideContent", false);

          that.getOwnerComponent().getModel("selectedAttachments").setProperty("/", null);
        });
      },

      _expandTreeItem: function (sPath) {

        if (!sPath) {
          return;
        }

        var paths = [];
        var parts = sPath.split("/");
        var temp = ""

        // var breadcrumbs = [];


        for (var i = 0; i < parts.length; i++) {
          if (i == 0) {
            temp += parts[i];
          } else {
            temp += "/" + parts[i]
          }
          paths.push(temp);
          // breadcrumbs.push({ name: parts[i], path: temp });
        }

        // breadcrumbs.pop();  // remove last element

        var that = this;
        paths.forEach(function (path) {
          var items = that.getView().byId("moveTree").getItems();
          items.forEach(function (item, index) {
            if (path === item.getBindingContext("targetTree").getObject("path")) {
              that.getView().byId("moveTree").expand(index);
            }
          })
        });


      },


    });
  }
);
