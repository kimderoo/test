sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("hogent.hogent.controller.List", {
            onInit: function () {
                var oFlight = {}
                var oModel = new JSONModel(oFlight);
                this.getView().setModel(oModel, "form");
            },

            handleSavePress: function () {
                var oForm = this.getView().getModel("form").getData();
                var odataModel = this.getView().getModel();
                oForm.Fldate = new Date(oForm.Fldate);


                odataModel.create("/flightSet", oForm, {
                    success: function (data, response) {
                        MessageBox.success("Data successfully created");
                    },
                    error: function (error) {
                        MessageBox.error("Error while creating the data");
                    }
                });
            },

            handleListItemPress: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var selectedCarrid = oEvent.getSource().getBindingContext().getProperty("Carrid");
                var selectedConnid = oEvent.getSource().getBindingContext().getProperty("Connid");
                var selectedFldate = oEvent.getSource().getBindingContext().getProperty("Fldate").toString();

                oRouter.navTo("detail", {
                    Carrid: selectedCarrid,
                    Connid: selectedConnid,
                    Fldate: selectedFldate
                });
            }
        });
    });