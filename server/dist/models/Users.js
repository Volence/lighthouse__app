"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User = new mongoose_1.default.Schema({
    userID: { type: String, unique: true },
    created: Date,
    lastSignIn: Date,
    userName: String,
    email: { type: String, unique: true },
    userType: String,
});
exports.default = mongoose_1.default.model('Users', User);
//# sourceMappingURL=Users.js.map