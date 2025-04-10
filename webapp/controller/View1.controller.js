sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller,MessageToast) => {
    "use strict";

    return Controller.extend("fintracker.controller.View1", {
        onInit() {
        },
        onExpenditurePrediction: function(){
            this.getOwnerComponent().getRouter().navTo("View2");
        },
        onLoans: function(){
            
            this.getOwnerComponent().getRouter().navTo("View3");
        },
        onWalletHistory: function(){
            this.getOwnerComponent().getRouter().navTo("View4");
        },
        openFeedbackDialog: function() {
            this.byId("feedbackDialog").open();
        },

        closeFeedbackDialog: function() {
            this.byId("feedbackDialog").close();
        },

        submitFeedback: function() {
            var sRating = this.byId("rating").getValue();
            var sFeedback = this.byId("feedbackText").getValue();

            if (!sRating ) {
                MessageToast.show("Please provide a rating");
                return;
            }

            this.byId("feedbackDialog").close();
            this.byId("thankYouDialog").open();
        },

        closeThankYouDialog: function() {
            this.byId("thankYouDialog").close();
        }
    });
});