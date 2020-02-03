import Site from '../../models/Site';
import Users from '../../models/Users';
import ConsoleErrorAudits from '../../models/ConsoleErrorAudits';
import moment from 'moment';
import { runAudits } from '../../controllers/lighthouseController';
const graphql = require('graphql');
const graphqlLanguage = require('graphql/language');
import verifyUser from '../../utils/verifyUser';

const graphqlResolvers = {
    sites: async (args: Arguments) => {
        try {
            if (args.siteName) {
                const site = await Site.findOne({ siteName: args.siteName.toLowerCase() })
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
        } catch (err) {
            throw err;
        }
    },
    consoleErrorAudits: async (args: Arguments) => {
        try {
            if (args.siteName) {
                const site = await ConsoleErrorAudits.findOne({ siteName: args.siteName.toLowerCase() }).populate('siteID');
                return [site];
            }
            const consoleErrors = await ConsoleErrorAudits.find().populate('siteID');
            return consoleErrors;
        } catch (err) {
            throw err;
        }
    },
    createSite: async (args: Arguments) => {
        const foundSite = await Site.findOne({ siteName: args.siteInput.siteName.toLowerCase() });
        if (foundSite) {
            throw new Error('Sorry that site already exists in the database!');
        } else {
            const time = moment.utc();
            const site = new Site({
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
            runAudits(args.siteInput.siteName);
            return results;
        }
    },
    signIn: async (args: SignInArguments) => {
        if (await verifyUser(args.clientData.userID, args.clientData.clientToken)) {
            const users = await Users.find();
            const time = moment.utc();
            if (users.length < 1) {
                const user = new Users({
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
            const user = await Users.findOne({ userID: args.clientData.userID });
            if (user === null) {
                const user = new Users({
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
        } else {
            return { error: 'Please log in again' };
        }
    },

    addAdmin: async (args: AdminEditArgs) => {
        const user = await Users.findOne({ email: args.email });
        if (user) {
            await user.update({ userType: 'Admin' });
            console.log(`Changing user ${args.email} to an admin`);
            return { success: 'Added user as Admin' };
        }
        return { error: 'User not found!' };
    },

    removeAdmin: async (args: AdminEditArgs) => {
        const user = await Users.findOne({ email: args.email });
        if (user) {
            await user.update({ userType: 'Basic' });
            console.log(`Changing user ${args.email} to a basic user`);
            return { success: 'Removed user as Admin' };
        }
        return { error: 'User not found!' };
    },

    users: async () => {
        try {
            const users = await Users.find();
            return users;
        } catch {
            return { error: 'No users found!' };
        }
    },

    runSiteAudits: async (args: { siteName: string[] } & {}) => {
        try {
            if (Object.keys(args).length < 1) {
                await runAudits();
                return { success: 'Ran audits on all sites' };
            }
            const runSiteAuditsLoop = async ([site, ...sites]: string[]) => {
                if (site === undefined) return;
                await runAudits(site);
                return runSiteAuditsLoop(sites);
            };
            await runSiteAuditsLoop(args.siteName);
            return { success: 'Ran audits on all sites entered' };
        } catch (error) {
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

export default graphqlResolvers;
