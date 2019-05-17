const mongoose = require('mongoose');

const consoleErrorDetailsSchema = mongoose.Schema({
    siteID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site'
    },
    siteName: String,
    pageType: String,
    url: String,
    created:  Date,
    summary: String,
    errorsText: [],
    warningsText: [],
    failedRequestsText: []
});

module.exports = mongoose.model('ConsoleErrorDetails', consoleErrorDetailsSchema);