const Constants = require("../utils/Constants");
const ORM = require("../utils/ORM");
var Utils = require("../utils/Utils");

var InvoiceApi = {

  createInvoice: function (req, res) {
    Utils.log(req);

    var pageid = req.params.pageid;

    var entity = {
      name: "invoice",
      properties: [
        { name: "page_id", value: pageid },
        { name: "name", value: req.body.invoiceName },
        { name: "total", value: req.body.total },
        { name: "payed_by", value: req.body.payedBy },
        { name: "invoice_date", value: req.body.invoiceDate },
        { name: "payment_date", value: req.body.paymentDate },
        { name: "invoice_number", value: req.body.invoiceNumber },
      ]
    }

    ORM.updateEntity({
      name: "page",
      id: ["page_id"],
      properties: [
        { name: "page_id", value: pageid },
        { name: "linked_entity", value: "invoice" },
      ]
    }).then(function () {

      return ORM.createEntity(entity);
    }).then(function (data) {
      Utils.buildResult(res, JSON.stringify(data));
    });

  },

  updateInvoice: function (req, res) {
    Utils.log(req);

    var pageid = req.params.pageid;

    var entity = {
      name: "invoice",
      id: ["invoice_id"],
      properties: [
        { name: "page_id", value: pageid },
        { name: "invoice_id", value: req.body.invoiceId },
        { name: "name", value: req.body.invoiceName },
        { name: "total", value: req.body.total },
        { name: "payed_by", value: req.body.payedBy },
        { name: "invoice_date", value: req.body.invoiceDate },
        { name: "payment_date", value: req.body.paymentDate },
        { name: "invoice_number", value: req.body.invoiceNumber },
      ]
    }
    ORM.updateEntity(entity).then(function (data) {
      Utils.buildResult(res, JSON.stringify(data));
    });
  },


  loadInvoice: function (req, res) {
    Utils.log(req);
    var pageid = req.params.pageid;


    var entity = {
      name: "invoice",
      properties: [
        { name: "page_id", value: pageid }
      ]
    }

    ORM.searchEntity(entity).then(function (data) {


      data = data.map(function (item) {
        return {
          pageId: item.page_id,
          invoiceId: item.invoice_id,
          invoiceName: item.name,
          total: item.total,
          payedBy: item.payed_by,
          invoiceDate: item.invoice_date,
          paymentDate: item.payment_date,
          invoiceNumber: item.invoice_number
        }
      })


      Utils.buildResult(res, JSON.stringify(data));
    });

  },




  executeStatement: function (req, res) {
    var statement = req.body.statement;
    var params = req.body.params;

    var sql = statement;

    if (sql === undefined || sql === "") {
      Utils.buildResult(res, JSON.stringify({}));
    } else {
      ORM._run(sql, params).then(function (data) {
        if (data) {
          Utils.buildResult(res, JSON.stringify(data));
        } else {
          Utils.buildResult(res, JSON.stringify({}));
        }
      })
    }

  },

  listTables: function (req, res) {
    ORM.listTables().then(function (data) {
      Utils.buildResult(res, JSON.stringify(data));
    })
  },

  createEntity: function (req, res) {
    ORM.createEntity(req.body.entity).then(function (data) {
      Utils.buildResult(res, JSON.stringify(data));
    })
  },

  readEntity: function (req, res) {
    ORM.readEntity(req.body.entity).then(function (data) {
      Utils.buildResult(res, JSON.stringify(data));
    })
  },

  updateEntity: function (req, res) {
    ORM.updateEntity(req.body.entity).then(function (data) {
      Utils.buildResult(res, JSON.stringify(data));
    })
  },

  deleteEntity: function (req, res) {
    ORM.deleteEntity(req.body.entity).then(function (data) {
      Utils.buildResult(res, JSON.stringify(data));
    })
  },

};

module.exports = InvoiceApi;
