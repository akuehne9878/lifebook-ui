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
    return BaseController.extend("lifebook.view.main.detail.workspaceList.WorkspaceList", {
      onInit: function (oEvent) {
        this.getOwnerComponent().registerController(this);
      
        var that = this;
        var oRestModel = new RestModel();
        oRestModel.listWorkspaces().then(function(data){
          that.getOwnerComponent().getModel("workspaces").setProperty("/", data);
        });
      
      },

      onPress: function(oEvent) {
        var obj = oEvent.getSource().getBindingContext("workspaces").getObject();
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        var that = this;
        var oRestModel = new RestModel();
        oRestModel.setCurrentWorkspace(obj).then(function(){

          that.getOwnerComponent()._workspace = obj.title;

          that.onBack();
          oRouter.navTo("page", {
            workspace: that.getOwnerComponent().getWorkspace(),
            path: ""
          });


          that.getController("lifebook.view.main.master.Master").reloadLifebookTree();

        })


      },

      onBack : function(oEvent) {
        var otherPage = "lifebook.view.main.master.Master";
        this.getModel("mdsPage").setProperty("/masterPageViewName", otherPage)
      },

      onClose: function (oEvent) {
        this.getModel("mdsPage").setProperty("/showMaster", false);
      },

    });
  }
);
