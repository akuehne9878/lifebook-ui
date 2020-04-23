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
    return BaseSideContentController.extend("lifebook.view.main.sidecontent.new.New", {
      onInit: function (oEvent) {
        this.getOwnerComponent().registerController(this);
      },

      setup: function (oOptions) {
        this.setModel(new JSONModel(oOptions), "options")
        this.setModel(new JSONModel({ placeholder: "Neue Seite", title: "", type: "standard" }))
      },


      onSave: function (oEvent) {
        var that = this;
        var path = this.getModel("options").getProperty("/parentPath")
        var caller = this.getModel("options").getProperty("/caller");

        var title = this.getModel().getProperty("/title");
        var type = this.getModel().getProperty("/type");
        var newPath = path + "/" + title;

        var oRestModel = new RestModel();
        oRestModel.createPage({ title: title, path: path, type: type, workspace: this.getOwnerComponent().getWorkspace()}).then(function (data) {

          if (caller.endsWith("Main")) {
            that.getOwnerComponent().navToPage(newPath);
            that.getModel("mdsPage").setProperty("/showSideContent", false);
          } else {
            that.getController("lifebook.view.main.master.Master").reloadLifebookTree().then(function() {
              that.getController("lifebook.view.main.Main")._loadSideContent(caller, "Seite verschieben", {mode: "page", preSelectedPath: newPath})
            });
          }

        });
      }
    });
  }
);