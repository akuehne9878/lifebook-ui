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
    return BaseSideContentController.extend("lifebook.view.main.sidecontent.newWorkspace.NewWorkspace", {
      onInit: function (oEvent) {
        this.getOwnerComponent().registerController(this);
      },

      setup: function (oOptions) {
        this.setModel(new JSONModel(oOptions), "options")
        this.setModel(new JSONModel({ placeholder: "Neuer Workspace", title: ""}))
      },


      onSave: function (oEvent) {
        var that = this;

        var title = this.getModel().getProperty("/title");

        var oRestModel = new RestModel();
        oRestModel.createWorkspace({ title: title}).then(function (data) {

          var list = new RestModel();
          list.listWorkspaces().then(function(data) {
            
            that.getModel("mdsPage").setProperty("/showSideContent", false);
            that.getOwnerComponent().getModel("workspaces").setProperty("/", data);
          });

        });
      }
    });
  }
);