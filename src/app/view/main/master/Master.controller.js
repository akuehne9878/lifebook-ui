sap.ui.define(
  [
    "lifebook/view/BaseController.controller",
    "lifebook/model/RestModel",
    "jquery.sap.global",
    "sap/m/MessageBox",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/base/Log"
  ],
  function (BaseController, RestModel, jQuery, MessageBox, Device, JSONModel, MessageToast, Fragment, Filter, FilterOperator, Log) {
    return BaseController.extend("lifebook.view.main.master.Master", {
      onInit: function (oEvent) {
        this.getOwnerComponent().registerController(this);
      },

      reloadLifebookTree: function () {
        var that = this;

        var p = new Promise(function (resolve, reject) {
          var oRestModel = new RestModel();
          oRestModel.tree({ workspace: that.getOwnerComponent().getWorkspace() }).then(function (data) {
            oRestModel.setProperty("/", data);

            if (data.items.length === 0) {
              that.getController("lifebook.view.main.Main").setViewMode("workspace");
              that.getOwnerComponent().getModel("currPage").setProperty("/", { path: "", title: "", content: "" });
            } else {
              that.getController("lifebook.view.main.Main").setViewMode("view");
            }
            that.getModel("targetTree").setProperty("/", data);
            that.getModel("tree").setProperty("/", data);

            resolve();
          });
        })
        return p;
      },

      onSelectionChange: function (oEvent) {
        var oBindingContext = oEvent.getParameter("listItem").getBindingContext("tree");
        var oObj = oBindingContext.getObject();

        if (oObj.type === "page") {
          this.getOwnerComponent().navToPage(oObj.path);
        } else {
          // workspace
          this.getOwnerComponent().navToPage("");
        }
      },

      onClose: function (oEvent) {
        this.getModel("mdsPage").setProperty("/showMaster", false);
      },


      onCreatePage: function (oEvent) {
        var that = this;
        var oBindingContext = oEvent.getSource().getBindingContext("tree");

        var oObj = oBindingContext.getObject();

        var oRestModel = new RestModel();
        oRestModel.createPage({ title: oObj.title, path: oObj.path, workspace: this.getOwnerComponent().getWorkspace() }).then(function (data) {
          that._prepareLifebookModel(data);
          that.getModel("tree").setProperty("/", data);
          that.getOwnerComponent().navToPage(oObj.path + "\\" + oObj.title);

        });
      },

      onCancelCreatePage: function (oEvent) {
        var oBindingContext = oEvent.getSource().getBindingContext("tree");
        oBindingContext.getModel().setProperty(oBindingContext.getPath() + "/type", "add");
        oBindingContext.getModel().setProperty(oBindingContext.getPath() + "/title", "Neue Seite");
      },

      expandTreeItem: function (sPath) {

        if (!sPath) {
          return;
        }

        sPath = sPath.replace(/\\/g, "/");

        var paths = [];
        var parts = sPath.split("/");
        var temp = ""

        var breadcrumbs = [];


        for (var i = 0; i < parts.length; i++) {
          if (i == 0) {
            temp += parts[i];
          } else {
            temp += "/" + parts[i]
          }
          paths.push(temp);
          breadcrumbs.push({ name: parts[i], path: temp });
        }

        breadcrumbs.pop();  // remove last element

        var oTree = this.getView().byId("lifebookTree");
        oTree.collapseAll();
        oTree.expandToLevel(1);

        var that = this;
        paths.forEach(function (path) {
          var items = oTree.getItems();
          items.forEach(function (item, index) {
            if (path === item.getBindingContext("tree").getObject("path")) {
              oTree.expand(index);
            }
          })
        });

        this.getModel("breadcrumbs").setData(breadcrumbs);

      },

      onFilter: function (oEvent) {

        // build filter array
        var aFilter = [];
        var sQuery = oEvent.getParameter("query");

        if (!sQuery) {
          sQuery = oEvent.getParameter("newValue");
        }

        if (sQuery) {
          aFilter.push(new Filter("title", FilterOperator.Contains, sQuery));
        }

        // filter binding
        var oList = this.getView().byId("lifebookTree");
        var oBinding = oList.getBinding("items");
        oBinding.filter(aFilter);
        oBinding.expand(0);
      },

      onExpandAll: function (oEvent) {
        var oTree = this.getView().byId("lifebookTree");
        oTree.expandToLevel(10);
      },

      expandToLevel1: function(oEvent) {
        var oTree = this.getView().byId("lifebookTree");
        oTree.expandToLevel(1);
      },

      onCollapseAll: function (oEvent) {
        var oTree = this.getView().byId("lifebookTree");
        oTree.collapseAll();

      }


    });
  }
);
