const mongoose = require('mongoose');
const moment = require ('moment');

const siteListSchema = mongoose.Schema({
    siteName: {
        type: String,
        trim: true,
        required: 'Please enter the name of the site!'
    },
    mainURL: {
        type: String,
        trim: true,
        required: 'Please enter your main url!'
    },
    mainURLAudits: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ConsoleErrorAudit'
        }
    ],
    mainURLAuditDetails: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ConsoleErrorDetails'
        }
    ],
    mainURLLighthouseScores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LighthouseScores'
        }
    ],
    mainURLLighthouseAuditDetails: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LighthouseAuditDetails'
        }
    ],
    categoryURL: {
        type: String,
        trim: true,
        required: 'Please enter your category url!'
    },
    categoryURLAudits: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ConsoleErrorAudit'
        }
    ],
    categoryURLAuditDetails: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ConsoleErrorDetails'
        }
    ],
    categoryURLLighthouseScores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LighthouseScores'
        }
    ],
    categoryURLLighthouseAuditDetails: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LighthouseAuditDetails'
        }
    ],
    productURL: {
        type: String,
        trim: true,
        required: 'Please enter your product url!'
    },
    productURLAudits: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ConsoleErrorAudit'
        }
    ],
    productURLAuditDetails: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ConsoleErrorDetails'
        }
    ],
    productURLLighthouseScores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LighthouseScores'
        }
    ],
    productURLLighthouseAuditDetails: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LighthouseAuditDetails'
        }
    ],
    created: {
        type: Date,
        default: moment.utc()
    }
});

module.exports = mongoose.model('Site', siteListSchema);