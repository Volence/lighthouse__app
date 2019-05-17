const mongoose = require('mongoose');

const LighthouseAuditDetails = mongoose.Schema({
    siteID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site'
    },
    created: Date,
    siteName: String,
    pageType: String,
    url: String,
    performanceAudits: {},
    seoAudits: {},
    accessibilityAudits: {},
    bestPracticesAudits: {}
});

module.exports = mongoose.model('LighthouseAuditDetails', LighthouseAuditDetails);