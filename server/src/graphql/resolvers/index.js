"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Site_1 = require("../../models/Site");
var ConsoleErrorAudits_1 = require("../../models/ConsoleErrorAudits");
var moment_1 = require("moment");
var graphql_1 = require("graphql");
var language_1 = require("graphql/language");
var graphqlResolvers = {
    sites: function (args) { return __awaiter(void 0, void 0, void 0, function () {
        var site, sites, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!args.siteName) return [3 /*break*/, 2];
                    return [4 /*yield*/, Site_1["default"].findOne({ siteName: args.siteName.toLowerCase() })
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
                            .populate('productURLLighthouseAuditDetails')];
                case 1:
                    site = _a.sent();
                    return [2 /*return*/, [site]];
                case 2: return [4 /*yield*/, Site_1["default"].find()
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
                        .populate('productURLLighthouseAuditDetails')];
                case 3:
                    sites = _a.sent();
                    return [2 /*return*/, sites];
                case 4:
                    err_1 = _a.sent();
                    throw err_1;
                case 5: return [2 /*return*/];
            }
        });
    }); },
    consoleErrorAudits: function (args) { return __awaiter(void 0, void 0, void 0, function () {
        var site, consoleErrors, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!args.siteName) return [3 /*break*/, 2];
                    return [4 /*yield*/, ConsoleErrorAudits_1["default"].findOne({ siteName: args.siteName.toLowerCase() }).populate('siteID')];
                case 1:
                    site = _a.sent();
                    return [2 /*return*/, [site]];
                case 2: return [4 /*yield*/, ConsoleErrorAudits_1["default"].find().populate('siteID')];
                case 3:
                    consoleErrors = _a.sent();
                    return [2 /*return*/, consoleErrors];
                case 4:
                    err_2 = _a.sent();
                    throw err_2;
                case 5: return [2 /*return*/];
            }
        });
    }); },
    createSite: function (args) { return __awaiter(void 0, void 0, void 0, function () {
        var foundSite, time, site, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Site_1["default"].findOne({ siteName: args.siteInput.siteName.toLowerCase() })];
                case 1:
                    foundSite = _a.sent();
                    if (!foundSite) return [3 /*break*/, 2];
                    throw new Error('Sorry that site already exists in the database!');
                case 2:
                    time = moment_1["default"].utc();
                    site = new Site_1["default"]({
                        siteName: args.siteInput.siteName
                            .split(' ')
                            .join('_')
                            .toLowerCase(),
                        mainURL: args.siteInput.mainURL,
                        categoryURL: args.siteInput.categoryURL,
                        productURL: args.siteInput.productURL,
                        created: time
                    });
                    return [4 /*yield*/, site.save()];
                case 3:
                    results = _a.sent();
                    console.log("Saved " + args.siteInput.siteName + " to the database!");
                    return [2 /*return*/, results];
            }
        });
    }); },
    Date: new graphql_1["default"].GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue: function (value) {
            return new Date(value);
        },
        serialize: function (value) {
            return value.getTime();
        },
        parseLiteral: function (ast) {
            if (ast.kind === language_1["default"].Kind.INT) {
                return new Date(ast.value);
            }
            return null;
        }
    })
};
exports["default"] = graphqlResolvers;
