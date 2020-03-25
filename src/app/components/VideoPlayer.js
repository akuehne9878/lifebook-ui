sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    "use strict";
    return Control.extend("lifebook.components.VideoPlayer", {
        metadata: {
            properties: {
                src: { type: "string", defaultValue: "" },
                width: { type: "string", defaultValue: "640px" },
                height: { type: "string", defaultValue: "360px" },
                poster: { type: "string", defaultValue: "" }
            }
        },
        init: function () {

        },

        renderer: function (oRM, oControl) {
            var width = oControl.getProperty("width");
            var height = oControl.getProperty("height");
            var poster = oControl.getProperty("poster");
            var src = oControl.getProperty("src");

            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write(">");
            oRM.write("<video class='video-js' controls='controls' preload='metadata' width='" + width + "' height='" + height + "'>");
            oRM.write("<source src='" + src + "#t=0.1' type='video/mp4'>");
            oRM.write("</video>");
            oRM.write("</div>");
        },

    });
});