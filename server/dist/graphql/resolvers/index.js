"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Site_1 = __importDefault(require("../../models/Site"));
const Users_1 = __importDefault(require("../../models/Users"));
const ConsoleErrorAudits_1 = __importDefault(require("../../models/ConsoleErrorAudits"));
const moment_1 = __importDefault(require("moment"));
const lighthouseController_1 = require("../../controllers/lighthouseController");
const graphql = require('graphql');
const graphqlLanguage = require('graphql/language');
const verifyUser_1 = __importDefault(require("../../utils/verifyUser"));
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
            const time = moment_1.default.utc();
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
            const results = await site.save();
            console.log(`Saved ${args.siteInput.siteName} to the database!`);
            lighthouseController_1.runAudits(args.siteInput.siteName);
            return results;
        }
    },
    signIn: async (args) => {
        if (await verifyUser_1.default(args.clientData.userID, args.clientData.clientToken)) {
            const users = await Users_1.default.find();
            const time = moment_1.default.utc();
            if (users.length < 1) {
                const user = new Users_1.default({
                    userID: args.clientData.userID,
                    created: time,
                    lastSignIn: time,
                    userName: args.clientData.userName,
                    email: args.clientData.email,
                    userType: 'Owner',
                });
                await user.save();
                console.log(`Added ${args.clientData.email} as the owner!`);
                return user;
            }
            const user = await Users_1.default.findOne({ userID: args.clientData.userID });
            if (user === null) {
                const user = new Users_1.default({
                    userID: args.clientData.userID,
                    created: time,
                    lastSignIn: time,
                    userName: args.clientData.userName,
                    email: args.clientData.email,
                    userType: 'Basic',
                });
                await user.save();
                console.log(`Added ${args.clientData.email} to the list of users!`);
                return user;
            }
            await user.update({ lastSignIn: time });
            return user;
        }
        else {
            return { error: 'Please log in again' };
        }
    },
    addAdmin: async (args) => {
        const user = await Users_1.default.findOne({ email: args.email });
        if (user) {
            await user.update({ userType: 'Admin' });
            console.log(`Changing user ${args.email} to an admin`);
            return { success: 'Added user as Admin' };
        }
        return { error: 'User not found!' };
    },
    removeAdmin: async (args) => {
        const user = await Users_1.default.findOne({ email: args.email });
        if (user) {
            await user.update({ userType: 'Basic' });
            console.log(`Changing user ${args.email} to a basic user`);
            return { success: 'Removed user as Admin' };
        }
        return { error: 'User not found!' };
    },
    users: async () => {
        try {
            const users = await Users_1.default.find();
            return users;
        }
        catch {
            return { error: 'No users found!' };
        }
    },
    runSiteAudits: async (args) => {
        try {
            if (Object.keys(args).length < 1) {
                await lighthouseController_1.runAudits();
                return { success: 'Ran audits on all sites' };
            }
            const runSiteAuditsLoop = async ([site, ...sites]) => {
                if (site === undefined)
                    return;
                await lighthouseController_1.runAudits(site);
                return runSiteAuditsLoop(sites);
            };
            await runSiteAuditsLoop(args.siteName);
            return { success: 'Ran audits on all sites entered' };
        }
        catch (error) {
            return { error: error };
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
};
exports.default = graphqlResolvers;
//# sourceMappingURL=index.js.map