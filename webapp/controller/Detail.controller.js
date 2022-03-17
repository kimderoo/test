sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("hogent.hogent.controller.Detail", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("detail").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function (oEvent) {

                var oArgs = oEvent.getParameter("arguments");
                var odataModel = this.getView().getModel()
                var oView = this.getView();

                oArgs.Fldate = new Date(oArgs.Fldate).toJSON();
                var urlPath = "/flightSet(Carrid='" + oArgs.Carrid + "',Connid='" + oArgs.Connid + "',Fldate=datetime'" + encodeURI(oArgs.Fldate.substr(0, 19)) + "')";
                
                oView.bindElement(urlPath);
                this.readElement(urlPath).done(function (oData) {
                    odataModel.refresh(true);
                }.bind(this));
                
            },

            handleNavButtonPress: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("home");
            },

            readElement: function (path, filter) {
                var oDeferred = jQuery.Deferred();
                var odataModel = this.getView().getModel();
    
                odataModel.read(path, {
                    filters: [filter],
                    success: function (oData) {
                        return oDeferred.resolve(oData);
                    }.bind(this),
                    error: function (oError) {
                        return oDeferred.reject(oError);
                    }.bind(this)
                });
                return oDeferred.promise();
            },

        });
    });