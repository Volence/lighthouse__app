require('./models/Site');
require('./models/ConsoleErrorAudits');
require('./models/ConsoleErrorDetails');
require('./models/LighthouseScores');
require('./models/LighthouseAuditDetails');
const CronJob = require('cron').CronJob;
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import graphqlHTTP from 'express-graphql';
import { runAudits } from './controllers/lighthouseController';

import graphqlSchema from './graphql/schema/index';
import graphqlResolvers from './graphql/resolvers/index';

const port = 3501;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongooseConnectString = 'mongodb://127.0.0.1:27017/lighthouse_app';
const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
};

mongoose.connect(mongooseConnectString, options);
mongoose.connection.on('MongoDB error', err => {
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});
mongoose.connection.once('open', function callback() {
    console.log('Connected to the database');
});

app.listen(port, () => console.log(`Lighthouse app listening on port ${port}!`));

app.use(
    '//graphql',
    graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlResolvers,
        graphiql: true,
        customFormatErrorFn: e => console.log('Connection error: ', e),
    })
);

const job = new CronJob('0 0 0 * * *', function() {
    console.log('running cron', job);
    runAudits();
});
