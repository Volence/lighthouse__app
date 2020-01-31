"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_graphql_1 = __importDefault(require("express-graphql"));
const index_1 = __importDefault(require("./graphql/schema/index"));
const index_2 = __importDefault(require("./graphql/resolvers/index"));
const port = 3501;
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const mongooseConnectString = 'mongodb://127.0.0.1:27017/lighthouse_app';
const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
};
mongoose_1.default.connect(mongooseConnectString, options);
mongoose_1.default.connection.on('MongoDB error', err => {
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});
mongoose_1.default.connection.once('open', function callback() {
    console.log('Connected to the database');
});
app.listen(port, () => console.log(`Lighthouse app listening on port ${port}!`));
app.use('//graphql', express_graphql_1.default({
    schema: index_1.default,
    rootValue: index_2.default,
    graphiql: true,
}));
//# sourceMappingURL=server.js.map