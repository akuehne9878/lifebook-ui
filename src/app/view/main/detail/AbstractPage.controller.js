sap.ui.define(
  [
    "lifebook/view/BaseController.controller",
    "lifebook/model/RestModel",
    "jquery.sap.global",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/core/mvc/Controller",
    "sap/base/Log",
    "sap/ui/core/format/NumberFormat",
    "sap/ui/Device",
    "sap/ui/core/BusyIndicator"
  ],

  function (BaseController, RestModel, jQuery, MessageBox, JSONModel, MessageToast, Fragment, Controller, Log, NumberFormat, Device, BusyIndicator) {
    return BaseController.extend("lifebook.view.main.detail.AbstractPage", {

      _pageTypeMap: {
        "standard": "lifebook.view.main.detail.page.type.standard.Standard",
        "invoice": "lifebook.view.main.detail.page.type.invoice.Invoice",
        "invoice_overview": "lifebook.view.main.detail.page.type.invoiceoverview.InvoiceOverview",
      },

      onInit: function (oEvent) {
        this.getOwnerComponent().registerController(this);
        this.getView().setModel(new JSONModel({ newLifebook: false, viewMode: true }), "meta");
        BusyIndicator.show();
      },

      onAfterRendering: function (oEvent) {
        BusyIndicator.hide();
      },



      reloadPage: function (sPath, bReloadTree) {
        var model = new RestModel();
        var that = this;

        var masterController = that.getController("lifebook.view.main.master.Master");
        var mainController = that.getController("lifebook.view.main.Main");

        function loadPage() {

          model.loadPage({ path: sPath, workspace: that.getOwnerComponent().getWorkspace() }).then(function (data) {

            data.files.forEach(function (item) {
              item.selected = false;
            });

            that.getModel("currPage").setProperty("/", data);

            var navContainer = that.byId("navContainer");
            var navContainerPage = navContainer.getPages().filter(function (view) {
              return view.getViewName() === that._pageTypeMap[data.type];
            })[0];
            navContainer.to(navContainerPage.getId(), "show");
            navContainerPage.getController().setup();

            masterController.expandTreeItem(sPath);
            that.getController("lifebook.view.main.Main").setViewMode("view");

            if (Device.system.phone) {
              that.getModel("mdsPage").setProperty("/showMaster", false);
              that.getModel("mdsPage").setProperty("/showSideContentSpace", false);
              that.getModel("mdsPage").setProperty("/showMainContent", true);
            }

          });
        }


        if (sPath === "/" || sPath === "" || sPath === undefined || sPath === "undefined") {
          this.getModel("mdsPage").setProperty("/detailPageViewName", "lifebook.view.main.detail.workspaceList.WorkspaceList");
          this.getModel("currPage").setProperty("/path", "");
          if (bReloadTree) {
            masterController.reloadLifebookTree().then(function () {
              mainController.setViewMode("workspace");
              masterController.expandToLevel1();
            })
          }
        } else {
          this.getModel("mdsPage").setProperty("/detailPageViewName", "lifebook.view.main.detail.AbstractPage");
          if (bReloadTree) {
            masterController.reloadLifebookTree().then(loadPage);
          } else {
            loadPage();
          }
        }





      },

      onLinkPress: function (oEvent) {
        var object = oEvent.getSource().getBindingContext("breadcrumbs").getObject();
        this.reloadPage(object.path, true);
      }

    });
  }
);
