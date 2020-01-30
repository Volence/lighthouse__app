"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var consoleErrorSchema = new mongoose_1["default"].Schema({
    siteID: {
        type: mongoose_1["default"].Schema.Types.ObjectId,
        ref: 'Site'
    },
    siteName: String,
    pageType: String,
    url: String,
    created: Date,
    errorCount: Number,
    warningCount: Number,
    failedRequestCount: Number
});
exports["default"] = mongoose_1["default"].model('ConsoleErrorAudit', consoleErrorSchema);
