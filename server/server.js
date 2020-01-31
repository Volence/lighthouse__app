"use strict";
exports.__esModule = true;
require('./models/Site');
require('./models/ConsoleErrorAudits');
require('./models/ConsoleErrorDetails');
require('./models/LighthouseScores');
require('./models/LighthouseAuditDetails');
var express_1 = require("express");
var cors_1 = require("cors");
var body_parser_1 = require("body-parser");
var mongoose_1 = require("mongoose");
var express_graphql_1 = require("express-graphql");
var index_1 = require("./graphql/schema/index");
var index_2 = require("./graphql/resolvers/index");
var port = 3501;
var app = express_1["default"]();
app.use(cors_1["default"]());
app.use(body_parser_1["default"].json());
app.use(body_parser_1["default"].urlencoded({ extended: true }));
var mongooseConnectString = 'mongodb://127.0.0.1:27017/lighthouse_app';
var options = {
    useNewUrlParser: true,
    useFindAndModify: false
};
mongoose_1["default"].connect(mongooseConnectString, options);
mongoose_1["default"].connection.on('MongoDB error', function (err) {
    console.error("\uD83D\uDE45 \uD83D\uDEAB \uD83D\uDE45 \uD83D\uDEAB \uD83D\uDE45 \uD83D\uDEAB \uD83D\uDE45 \uD83D\uDEAB \u2192 " + err.message);
});
mongoose_1["default"].connection.once('open', function callback() {
    console.log('Connected to the database');
});
app.listen(port, function () { return console.log("Lighthouse app listening on port " + port + "!"); });
app.use('//graphql', express_graphql_1["default"]({
    schema: index_1["default"],
    rootValue: index_2["default"],
    graphiql: true
}));
