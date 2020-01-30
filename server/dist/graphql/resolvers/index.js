"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Site_1 = __importDefault(require("../../models/Site"));
const ConsoleErrorAudits_1 = __importDefault(require("../../models/ConsoleErrorAudits"));
const moment_1 = __importDefault(require("moment"));
const graphql_1 = __importDefault(require("graphql"));
const language_1 = __importDefault(require("graphql/language"));
const graphqlResolvers = {
    sites: async (args) => {
        try {
            if (args.siteName) {
                const site = await Site_1.default.findOne({ siteName: args.siteName.toLowerCase() })
                    .populate('mainURLAudits')
                    .populate('mainURLAuditDetails')
                    .populate('categoryURLAudits')
                    .populate('categoryURLAuditDetails')
                    .populate('productURLAudits')
                    .populate('productURLAuditDetails')
                    .populate('mainURLLighthouseScores')
                    .populate('categoryURLLighthouseScores')
                    .populate('productURLLighthouseScores')
                    .populate('mainURLLighthouseAuditDetails')
                    .populate('categoryURLLighthouseAuditDetails')
                    .populate('productURLLighthouseAuditDetails');
                return [site];
            }
            const sites = await Site_1.default.find()
                .populate('mainURLAudits')
                .populate('mainURLAuditDetails')
                .populate('categoryURLAudits')
                .populate('categoryURLAuditDetails')
                .populate('productURLAudits')
                .populate('productURLAuditDetails')
                .populate('mainURLLighthouseScores')
                .populate('categoryURLLighthouseScores')
                .populate('productURLLighthouseScores')
                .populate('mainURLLighthouseAuditDetails')
                .populate('categoryURLLighthouseAuditDetails')
                .populate('productURLLighthouseAuditDetails');
            return sites;
        }
        catch (err) {
            throw err;
        }
    },
    consoleErrorAudits: async (args) => {
        try {
            if (args.siteName) {
                const site = await ConsoleErrorAudits_1.default.findOne({ siteName: args.siteName.toLowerCase() }).populate('siteID');
                return [site];
            }
            const consoleErrors = await ConsoleErrorAudits_1.default.find().populate('siteID');
            return consoleErrors;
        }
        catch (err) {
            throw err;
        }
    },
    createSite: async (args) => {
        const foundSite = await Site_1.default.findOne({ siteName: args.siteInput.siteName.toLowerCase() });
        if (foundSite) {
            throw new Error('Sorry that site already exists in the database!');
        }
        else {
            let time = moment_1.default.utc();
            const site = new Site_1.default({
                siteName: args.siteInput.siteName
                    .split(' ')
                    .join('_')
                    .toLowerCase(),
                mainURL: args.siteInput.mainURL,
                categoryURL: args.siteInput.categoryURL,
                productURL: args.siteInput.productURL,
                created: time,
            });
            let results = await site.save();
            console.log(`Saved ${args.siteInput.siteName} to the database!`);
            return results;
        }
    },
    Date: new graphql_1.default.GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value);
        },
        serialize(value) {
            return value.getTime();
        },
        parseLiteral(ast) {
            if (ast.kind === language_1.default.Kind.INT) {
                return new Date(ast.value);
            }
            return null;
        },
    }),
};
exports.default = graphqlResolvers;
//# sourceMappingURL=index.js.map