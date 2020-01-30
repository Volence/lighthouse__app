import mongoose from 'mongoose';

const LighthouseAuditDetails = new mongoose.Schema({
    siteID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site',
    },
    created: Date,
    siteName: String,
    pageType: String,
    url: String,
    performanceAudits: {},
    seoAudits: {},
    accessibilityAudits: {},
    bestPracticesAudits: {},
});

export default mongoose.model('LighthouseAuditDetails', LighthouseAuditDetails);
