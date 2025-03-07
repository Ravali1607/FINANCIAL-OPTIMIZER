sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/Dialog",
    "sap/m/Input",
    "sap/m/Button",
    "sap/m/MessageBox"
], (Controller, Filter, FilterOperator, Sorter, Dialog, Input, Button, MessageBox) => {
    "use strict";

    return Controller.extend("fintracker.controller.View3", {
        onInit() {
        },
        NavBack: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("View1"); 
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oTable = this.byId("employeeTable");
            var oBinding = oTable.getBinding("items");

            if (sQuery) {
                var oFilter = new Filter({
                    path: "BankName",
                    operator: FilterOperator.Contains,
                    value1: sQuery
                });
                oBinding.filter([oFilter]);
            } else {
                oBinding.filter([]);
            }
        },

        onFilterPress: function () {
            var oView = this.getView();

            if (!this._oFilterDialog) {
                this._oFilterDialog = new Dialog({
                    title: "Filter by Rate of Interest",
                    content: new Input({
                        placeholder: "Enter minimum rate of interest",
                        type: "Number"
                    }),
                    beginButton: new Button({
                        text: "Apply",
                        press: function () {
                            var oDialog = this.getParent(); 
                            var oInput = oDialog.getContent()[0]; 
                            var sValue = oInput.getValue();

                            if (sValue) {
                                var oTable = oView.byId("employeeTable");
                                var oBinding = oTable.getBinding("items");

                                // Create a filter for Rate of Interest
                                var oFilter = new Filter({
                                    path: "BANK_ROI",
                                    operator: FilterOperator.GE, // Greater than or equal to
                                    value1: parseFloat(sValue)
                                });

                                // Apply the filter
                                oBinding.filter([oFilter]);
                            } else {
                                MessageBox.error("Please enter a valid rate of interest.");
                            }

                            oDialog.close(); // Close the dialog
                        }
                    }),
                    endButton: new Button({
                        text: "Cancel",
                        press: function () {
                            this.getParent().close(); // Close the dialog
                        }
                    })
                });
            }

            this._oFilterDialog.open();
        },

        onSortPress: function () {
            var oTable = this.byId("employeeTable");
            var oBinding = oTable.getBinding("items");

            var oSorter = new Sorter({
                path: "BankName",
                descending: false
            });
            oBinding.sort([oSorter]);
        },

        onSelectionChange: function (oEvent) {
            var aSelectedItems = oEvent.getParameter("selectedItems");
            MessageBox.information("Selected items: " + aSelectedItems.length);
        }
    });
});