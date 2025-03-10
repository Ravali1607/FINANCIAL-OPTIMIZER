sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller,JSONModel) => {
    "use strict";

    return Controller.extend("fintracker.controller.View2", {
        onInit() {
            var oModel = new sap.ui.model.json.JSONModel({
                "month" :"",
                "salary" : "",
                "billPayments" : "",
                "grocery" : "",
                "entertainment" : "",
                "hospitality" : "",
                "variableExpenses" : "",
                "userExpenditureTotal" : "",                        // store user expenditure total
                "profitLossStatus": "",                          // store profit/loss status
                "suggestions": "",                               // store suggestions
                "predictedValues": [],                          // Array to store transformed data for the table
                "totalPredictedExpenses" : "",
                "remainingSalary" : "",
                "monthlyData": []                               // Array to store monthly data
            });
            this.getOwnerComponent().setModel(oModel, "sharedModel");
            this.getView().setModel(oModel);

            // Initialize the JSON model for predicted expenses
            var oExpensesModel = new sap.ui.model.json.JSONModel({
                PredictedExpenses: []
            });
            this.getView().setModel(oExpensesModel, "expensesModel");
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("View1");
        },

        // Function to estimate the monthly expenditures and update the pie chart
        onEstimateExpenses: function () {
            var oView = this.getView();
            var oModel = oView.getModel();
            var oExpensesModel = oView.getModel("expensesModel");
        
            // Retrieve values from user input fields
            var month = oView.byId("month").getValue();
            var salary = parseFloat(oView.byId("salary").getValue()) || 0;
            var billPayments = parseFloat(oView.byId("billPayments").getValue()) || 0;
            var grocery = parseFloat(oView.byId("grocery").getValue()) || 0;
            var entertainment = parseFloat(oView.byId("entertainment").getValue()) || 0;
            var hospitality = parseFloat(oView.byId("hospitality").getValue()) || 0;
            var variableExpenses = parseFloat(oView.byId("variableExpenses").getValue()) || 0;
            // var savings = parseFloat(oView.byId("savings").getValue()) || 0;
        
            // Calculate User Expenditure Total
            var userExpenditureTotal = billPayments + grocery + entertainment +
                                      hospitality + variableExpenses ;
        
            // Determine the percentage to adjust expenses based on salary
            var adjustmentPercentage;
            if (salary < 30000) {
                adjustmentPercentage = 0.7; // 70% of the input values
            } else if (salary >= 30000 && salary <= 60000) {
                adjustmentPercentage = 0.8; // 80% of the input values
            } else {
                adjustmentPercentage = 0.9; // 90% of the input values
            }
        
            // Calculate predicted values for each category
            var predictedBillPayments = billPayments * adjustmentPercentage;
            var predictedGrocery = grocery * adjustmentPercentage;
            var predictedEntertainment = entertainment * adjustmentPercentage;
            var predictedHospitality = hospitality * adjustmentPercentage;
            var predictedVariableExpenses = variableExpenses * adjustmentPercentage;
            // var predictedSavings = savings * adjustmentPercentage;
        
            // Calculate Total Predicted Expenses
            var totalPredictedExpenses = predictedBillPayments + predictedGrocery + predictedEntertainment +
                                         predictedHospitality + predictedVariableExpenses ;
        
            // Calculate Remaining Salary
            var remainingSalary = salary - totalPredictedExpenses;
        
            // Determine if the employee is in profit or loss
            var profitLossStatus;
            var suggestions;
            if (remainingSalary > 0) {
                profitLossStatus = "Profit";
                suggestions = "You are in profit! Consider investing your remaining amount in:\n" +
                               "1. Fixed Deposits (FDs) for safe returns.\n" +
                               "2. Mutual Funds for higher growth potential.\n" +
                               "3. Stock Market (if you have a higher risk appetite).\n" +
                               "4. Emergency Fund to secure your future.";
            } else if (remainingSalary < 0) {
                profitLossStatus = "Loss";
                suggestions = "You are in loss. Consider reducing expenses in:\n" +
                             "1. Entertainment (limit dining out and subscriptions).\n" +
                             "2. Hospitality (reduce unnecessary travel expenses).\n" +
                             "3. Variable Expenses (cut down on impulsive purchases).\n" +
                             "4. Review your grocery and utility bills for savings.";
            } else {
                profitLossStatus = "Break-even";
                suggestions = "You are at break-even. Consider:\n" +
                              "1. Increasing your savings to build a financial cushion.\n" +
                              "2. Reducing discretionary expenses (entertainment, hospitality).\n" +
                              "3. Exploring small investments like recurring deposits (RDs).";
            }
        
            // Transform predicted values into an array for the table
            var aPredictedValues = [
                { "category": "Bill Payments", "value": predictedBillPayments },
                { "category": "Grocery", "value": predictedGrocery },
                { "category": "Entertainment", "value": predictedEntertainment },
                { "category": "Hospitality", "value": predictedHospitality },
                { "category": "Variable Expenses", "value": predictedVariableExpenses }
                // { "category": "Savings", "value": predictedSavings }
            ];
            // Update the model with the two segments for the pie chart
            var aPredictedExpenses = [
                { "label": "Total Expenses", "value": totalPredictedExpenses },
                { "label": "Remaining Amount", "value": remainingSalary }
            ];
        
            oExpensesModel.setProperty("/PredictedExpenses", aPredictedExpenses);

            // Save the monthly data
            var aMonthlyData = oModel.getProperty("/monthlyData");
            aMonthlyData.push({
                "month": month,
                "totalPredictedExpenses": totalPredictedExpenses,
                "remainingSalary":remainingSalary
            });
            // Update the model with the transformed data
            oModel.setProperty("/userExpenditureTotal", userExpenditureTotal); // Update user expenditure total
            oModel.setProperty("/predictedValues", aPredictedValues);
            oModel.setProperty("/totalPredictedExpenses", totalPredictedExpenses);
            oModel.setProperty("/remainingSalary", remainingSalary);
            oModel.setProperty("/profitLossStatus", profitLossStatus); // Update the profit/loss status
            oModel.setProperty("/suggestions", suggestions); // Update the suggestions
            oModel.setProperty("/monthlyData", aMonthlyData);

            this.reset();
        },

        // Formatter for currency values
        formatCurrency: function (fValue) {
            return parseFloat(fValue).toFixed(2);
        },

        reset: function(){
            var oView = this.getView();
            oView.byId("month").setValue("");
            oView.byId("salary").setValue("");
            oView.byId("billPayments").setValue("");
            oView.byId("grocery").setValue("");
            oView.byId("entertainment").setValue("");
            oView.byId("hospitality").setValue("");
            oView.byId("variableExpenses").setValue("");
        }
    });
});