sap.ui.define(["sap/ui/Device", 'sap/ui/core/XMLComposite'], function (Device, XMLComposite) {
    "use strict";


    return XMLComposite.extend("lifebook.components.MDSPage", {
        metadata: {
            properties: {
                showPrimaryHeader: { type: "boolean", defaultValue: true },
                showSecondaryHeader: { type: "boolean", defaultValue: true },
                showDetailHeader: { type: "boolean", defaultValue: true },
                showSideContent: { type: "boolean", defaultValue: true },
                showMainContent: { type: "boolean", defaultValue: true },
                showSideContentSpace: { type: "boolean", defaultValue: true },
                showMaster: { type: "boolean", defaultValue: true },
                showDetail: { type: "boolean", defaultValue: true },
                sideContentTitle: { type: "string", defaultValue: "" },
                sideContentViewName: { type: "string", defaultValue: "" },
                masterPageViewName: { type: "string", defaultValue: "" },
                detailPageViewName: { type: "string", defaultValue: "" }
            },

            events: {
                afterCloseSideContent: {
                    parameters: {
                        opener: "sap.ui.core.Control"
                    }
                }
            },
            aggregations: {
                items: {
                    type: "sap.ui.core.Control",
                    invalidate: true
                },
                primaryHeader: {
                    type: "sap.m.IBar",
                    multiple: false,
                    forwarding: {
                        idSuffix: "--primaryPage",
                        aggregation: "customHeader"
                    }
                },

                secondaryHeader: {
                    type: "sap.m.IBar",
                    multiple: false,
                    forwarding: {
                        idSuffix: "--secondaryPage",
                        aggregation: "customHeader"
                    }
                },

                detailHeader: {
                    type: "sap.m.IBar",
                    multiple: false,
                    forwarding: {
                        idSuffix: "--detailContainer",
                        aggregation: "customHeader"
                    }
                },

                masterPage: {
                    type: "sap.ui.core.Control",
                    multiple: true,
                    forwarding: {
                        idSuffix: "--masterPageContainer",
                        aggregation: "pages"
                    }
                },

                detailPage: {
                    type: "sap.ui.core.Control",
                    multiple: true,
                    forwarding: {
                        idSuffix: "--detailPageContainer",
                        aggregation: "pages"
                    }
                },

                sideContent: {
                    type: "sap.ui.core.Control",
                    multiple: true,
                    forwarding: {
                        idSuffix: "--sideContentNavContainer",
                        aggregation: "pages"
                    }
                }

            },

            defaultAggregation: "items",
        },

        fragment: "lifebook.components.MDSPage",

        setSideContentViewName: function (sViewName) {
            this.setNavContainerPage(sViewName, "sideContentNavContainer");
        },

        setMasterPageViewName: function (sViewName) {
            this.setNavContainerPage(sViewName, "masterPageContainer");
        },

        setDetailPageViewName: function (sViewName) {
            this.setNavContainerPage(sViewName, "detailPageContainer");
        },

        setNavContainerPage: function (sViewName, sNavContainerId) {
            var navContainer = this.byId(sNavContainerId);
            var page = this.getNavContainerPage(sViewName, navContainer);
            if (page) {
                navContainer.to(page.getId(), "show");
            }
        },

        getNavContainerPage: function (sViewName, oNavContainer) {
            var page = oNavContainer.getPages().filter(function (page) {
                return page.getViewName() === sViewName;
            })[0]
            return page;
        },

        setShowMaster: function (bValue) {
            if (bValue === false) {
                this.byId("splitContainer").toDetail(this.byId("splitContainer").getDetailPages()[0])
            } else {
                this.byId("splitContainer").backMaster(this.byId("splitContainer").getMasterPages()[0])
            }
        },

        setShowSideContent: function (bValue) {
            if (Device.system.phone) {
                this.setShowSideContentSpace(bValue);
            }
            this.setProperty("showSideContent", bValue)
            //this.showSideContent = bValue;
        },


        onCloseSideContent: function (oEvent) {
            this.setShowSideContent(false);

            var navContainer = this.byId("sideContentNavContainer");
            this.fireEvent("afterCloseSideContent", { value: navContainer.getCurrentPage() });
        }

    });
});
