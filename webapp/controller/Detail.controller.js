sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/Token',
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Token, JSONModel, Fragment) {
        "use strict";

        return Controller.extend("hogent.hogent.controller.Detail", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("detail").attachMatched(this._onRouteMatched, this);

                //define col model
                this.oColModel = new JSONModel({
                    "cols": [
                        {
                            "label": "Id",
                            "template": "id"
                        },
                        {
                            "label": "Name",
                            "template": "Name"
                        },
                        {
                            "label": "Genre",
                            "template": "Genre"
                        },
                        {
                            "label": "Developer",
                            "template": "Developer"
                        },
                        {
                            "label": "Platform",
                            "template": "Platform"
                        },
                    ]
                });

                //set multi input default
                this._oMultiInput = this.getView().byId("multiInput");
                this._oMultiInput.setTokens(this._getDefaultTokens());

                //init gamesCollection model
                var oGamesCollection = {}
                var oModel = new JSONModel(oGamesCollection);
                this.getView().setModel(oModel, "gamesCollection");

            },

            _onRouteMatched: function (oEvent) {

                var oArgs = oEvent.getParameter("arguments");
                var odataModel = this.getView().getModel();
                var oView = this.getView();

                oArgs.Fldate = new Date(oArgs.Fldate).toJSON();
                var urlPath = "/flightSet(Carrid='" + oArgs.Carrid + "',Connid='" + oArgs.Connid + "',Fldate=datetime'" + encodeURI(oArgs.Fldate.substr(0, 19)) + "')";

                oView.bindElement(urlPath);
                this.readElement(urlPath, odataModel).done(function (oData) {
                    odataModel.refresh(true);
                    //var sPlaneType = oData.Planetype;
                    //this._oMultiInput = this.getView().byId("multiInput");
                    //this._oMultiInput.setTokens(this._getDefaultTokens(sPlaneType));

                }.bind(this));

                
                this.getGames();


            },

            getGames: function () {
                var oGames = this.getView().getModel("games");
                var oView = this.getView();

                var urlPath = "/ZC_TCHR_GAMES_SH?$top=20";
                //oView.bindElement(urlPath);
                this.readElement(urlPath, oGames).done(function (oData) {
                    oView.getModel("gamesCollection").setData(oData.results);

                }.bind(this));
            },

            handleNavButtonPress: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("home");
            },

            readElement: function (path, model, filter) {
                var oDeferred = jQuery.Deferred();

                model.read(path, {
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

            onValueHelpRequested: function () {
                //get columns
                var aCols = this.oColModel.getData().cols;
                var oView = this.getView();
                var oGamesCollection = oView.getModel("gamesCollection");

                //load fragment & bind
                Fragment.load({
                    name: "hogent.hogent.fragment.ValueHelpDialogBasic",
                    controller: this
                }).then(function name(oFragment) {
                    //set to view
                    this._oValueHelpDialog = sap.ui.xmlfragment("hogent.hogent.fragment.ValueHelpDialogBasic", this);
                    this.getView().addDependent(this._oValueHelpDialog);

                    //bind table
                    this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                        oTable.setModel(oGamesCollection);
                        oTable.setModel(this.oColModel, "columns");

                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", "/");
                        }

                        if (oTable.bindItems) {
                            oTable.bindAggregation("items", "/", function () {
                                return new ColumnListItem({
                                    cells: aCols.map(function (column) {
                                        return new Label({ text: "{" + column.template + "}" });
                                    })
                                });
                            });
                        }

                        this._oValueHelpDialog.update();
                    }.bind(this));

                    this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
                    this._oValueHelpDialog.open();
                }.bind(this));
            },

            onValueHelpOkPress: function (oEvent) {
                var aTokens = oEvent.getParameter("tokens");
                this._oMultiInput.setTokens(aTokens);
                this._oValueHelpDialog.close();
            },

            onValueHelpCancelPress: function () {
                this._oValueHelpDialog.close();
            },

            onValueHelpAfterClose: function () {
                this._oValueHelpDialog.destroy();
            },

            _getDefaultTokens: function () {
                var oToken1 = new Token({
                    key: "FV",
                    text: "Farmville"
                });

                var oToken2 = new Token({
                    key: "MK",
                    text: "Mario Kart"
                });

                return [oToken1, oToken2];
            }

        });
    });