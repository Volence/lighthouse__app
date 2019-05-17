const Site = require('../../models/Site');
const ConsoleErrorAudits = require('../../models/ConsoleErrorAudits');
const moment = require ('moment');
const graphql = require ('graphql');
const graphqlLanguage = require ('graphql/language');

module.exports = {
    sites: async (args) => {
        try {
            if (args.siteName) {
                const site = await Site.findOne({'siteName': args.siteName.toLowerCase()})
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
            const sites = await Site.find()
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
        } catch(err) {
            throw err;
        }
    },
    consoleErrorAudits: async (args) => {
        try {
            if (args.siteName) {
                const site = await ConsoleErrorAudits.findOne({'siteName': args.siteName.toLowerCase()}).populate('siteID');
                return [site];
            }
            const consoleErrors = await ConsoleErrorAudits.find().populate('siteID');
            return consoleErrors;
        } catch(err) {
            throw err;
        }
    },
    createSite: async (args) => {
        const foundSite = await Site.findOne({'siteName': args.siteInput.siteName.toLowerCase()});
        if (foundSite) {
            throw new Error('Sorry that site already exists in the database!');
        } else {
            let time = moment.utc();
            const site = new Site({
                siteName: args.siteInput.siteName.split(' ').join('_').toLowerCase(),
                mainURL: args.siteInput.mainURL,
                categoryURL: args.siteInput.categoryURL,
                productURL: args.siteInput.productURL,
                created: time
            });
            let results = await site.save();
            console.log(`Saved ${args.siteInput.siteName} to the database!`);
            return results;
        }
    },
    Date: new graphql.GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
          return new Date(value);
        },
        serialize(value) {
          return value.getTime();
        },
        parseLiteral(ast) {
          if (ast.kind === graphqlLanguage.Kind.INT) {
            return new Date(ast.value);
          }
          return null;
        },
    }),
}