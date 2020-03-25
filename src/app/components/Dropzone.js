sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    "use strict";
    return Control.extend("lifebook.components.Dropzone", {
        metadata: {
            properties: {
                width: { type: "string", defaultValue: "100%" },
                height: { type: "string", defaultValue: "100%" },
            }
        },
        init: function () {

        },

        renderer: function (oRM, oControl) {

            var width = oControl.getProperty("width");
            var height = oControl.getProperty("height");

            oRM.write("<div width='" + width + "' height='" + height + "'");
            oRM.writeControlData(oControl);
            oRM.write(">");
            oRM.write("<form action='/upload-target' class='dropzone' width='" + width + "' height='" + height + "'></form>");
            oRM.write("</div>");
        },

    });
});