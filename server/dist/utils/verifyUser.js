"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { OAuth2Client } = require('google-auth-library');
const verifyUser = async (userID, clientToken) => {
    try {
        const client = new OAuth2Client(userID);
        const verify = async () => {
            await client.verifyIdToken({
                idToken: clientToken,
                audience: process.env.GOOGLE_APP_TAG,
            });
        };
        await verify();
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.default = verifyUser;
//# sourceMappingURL=verifyUser.js.map