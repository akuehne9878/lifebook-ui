sap.ui.define(
  [
    "lifebook/view/main/sidecontent/BaseSideContentController.controller",
    "lifebook/model/RestModel",
    "jquery.sap.global",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/PDFViewer",
    "sap/ui/core/Fragment",
    "sap/ui/core/mvc/Controller",
    "sap/base/Log"
  ],
  function (BaseSideContentController, RestModel, jQuery, MessageBox, JSONModel, MessageToast, PDFViewer, Fragment, Controller, Log) {
    return BaseSideContentController.extend("lifebook.view.main.sidecontent.attachment.Attachment", {
      onInit: function (oEvent) {
        this.getOwnerComponent().registerController(this);

        this._pdfViewer = new PDFViewer();
        this.getView().addDependent(this._pdfViewer);
      },

      setup: function (oOptions) {
        this.setModel(oOptions, "options");
        this.getView().setModel(new JSONModel({ title: this.getOwnerComponent().getModel("currAttachment").getProperty("/title") }))
      },

      onDownload: function (oEvent) {
        var obj = this.getOwnerComponent().getModel("currAttachment").getData();
        window.location.href = obj.file + "?download=true";
      },

      onViewInBrowser: function (oEvent) {
        var obj = this.getOwnerComponent().getModel("currAttachment").getData();
        window.open(obj.file, "_blank");
      },


      onViewPDF: function (oEvent) {

        var obj = this.getOwnerComponent().getModel("currAttachment").getData();

        var currPage = this.getView()
          .getModel("currPage")
          .getData();

        this._pdfViewer.setSource("/api/getFile?path=" + currPage.path + "&" + "name=" + obj.name);
        this._pdfViewer.setTitle(obj.name);
        this._pdfViewer.setShowDownloadButton(false);
        this._pdfViewer.open();

      },

      onGallery: function (oEvent) {
        var obj = this.getOwnerComponent().getModel("currAttachment").getData();

        var app = this.getController("lifebook.view.App").getView().byId("app");
        app.to(app.getPages()[1]);


      },

    });
  }
);
