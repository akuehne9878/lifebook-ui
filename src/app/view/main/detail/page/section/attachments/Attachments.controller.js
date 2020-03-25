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
    "sap/ui/core/format/NumberFormat"
  ],
  function (BaseController, RestModel, jQuery, MessageBox, JSONModel, MessageToast, Fragment, Controller, Log, NumberFormat) {
    return BaseController.extend("lifebook.view.main.detail.page.section.attachments.Attachments", {

      onInit: function (oEvent) {
        this.getOwnerComponent().registerController(this);
      },

      onPress: function (oEvent) {

        this.unselectAllAttachments();

        var oBindingContext = oEvent.getSource().getBindingContext("currPage");
        oBindingContext.getModel().setProperty(oBindingContext.getPath() + "/selected", true);

        var currObject = oBindingContext.getObject();
        this.getOwnerComponent().getModel("currAttachment").setProperty("/", currObject);

        this.getOwnerComponent().getModel("selectedAttachments").setProperty("/", [currObject]);


        var sideContent = this._getSideContentView(currObject);

        var mainController = this.getController("lifebook.view.main.Main");
        mainController.setViewMode("singleAttachment");
        mainController._changeSideContent(sideContent, currObject.name);

      },

      onSelectionChange: function (oEvent) {

        var mainController = this.getController("lifebook.view.main.Main");

        var selectedAttachments = this.getSelectedAttachments();
        this.getOwnerComponent().getModel("selectedAttachments").setProperty("/", selectedAttachments);

        if (selectedAttachments.length === 0) {
          // close
          this.getModel("mdsPage").setProperty("/showSideContent", false);
          this.getOwnerComponent().getModel("currAttachment").setProperty("/", null);

          mainController.setViewMode("view");
        } else if (selectedAttachments.length === 1) {
          // load single

          var currObject = this.getModel("currPage").getData().files.filter(function (item) {
            return item.selected === true;
          })[0];


          var sideContent = this._getSideContentView(currObject);

          mainController.setViewMode("singleAttachment");
          mainController._changeSideContent(sideContent, currObject.name);
        } else {
          // load multiple
          mainController.setViewMode("selection");
          mainController._changeSideContent("lifebook.view.main.sidecontent.attachment.AttachmentMultiple", "");
        }

      },

      _getSideContentView: function (currObject) {

        this.getOwnerComponent().getModel("currAttachment").setProperty("/", currObject);

        var sideContent = "lifebook.view.main.sidecontent.attachment.AttachmentDefault";

        if (currObject.type === "PDF") {
          sideContent = "lifebook.view.main.sidecontent.attachment.AttachmentPdf";
        } else if (currObject.type === "JPG") {
          sideContent = "lifebook.view.main.sidecontent.attachment.AttachmentImage";
        } else if (currObject.type === "MP4") {
          sideContent = "lifebook.view.main.sidecontent.attachment.AttachmentVideo";
        } else if (currObject.type === "STL") {
          sideContent = "lifebook.view.main.sidecontent.attachment.AttachmentSTL";
        }
        return sideContent;
      },



      onDownloadAttachment: function (oEvent) {
        var that = this;
        var oBindingContext = oEvent.getSource().getBindingContext("currPage");

        var oObj = oBindingContext.getObject();

        var path = decodeURICompont(
          this.getModel("currPage")
            .getProperty("/path")
        );
        window.open(path + "/" + oObj.name, "_blank");
      },

      getSelectedAttachments: function () {
        var data = this.getModel("currPage").getData();
        return data.files.filter(function (item) {
          return item.selected === true;
        });
      },

      unselectAllAttachments() {
        var data = this.getModel("currPage").getData();
        data.files.forEach(function (item) {
          item.selected = false;
        })
        this.getModel("currPage").setProperty("/", data);

        this.getOwnerComponent().getModel("selectedAttachments").setProperty("/", []);
      },

    });
  }
);
