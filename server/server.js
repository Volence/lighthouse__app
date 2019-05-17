require('./models/Site');
require('./models/ConsoleErrorAudits');
require('./models/ConsoleErrorDetails');
require('./models/LighthouseScores');
require('./models/LighthouseAuditDetails');
const express = require('express');
const cors = require('cors')
const port = 3501;
const bodyParser = require('body-parser');
const moment = require ('moment');
const routes = require('./routes/index');
const app = express();
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongooseConnectString = 'mongodb://127.0.0.1:27017/lighthouse_app'
const options = {
  useNewUrlParser: true,
  useFindAndModify: false
}

mongoose.connect(mongooseConnectString, options);
mongoose.connection.on('MongoDB error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});
mongoose.connection.once('open', function callback () {
    console.log("Connected to the database");
});

app.listen(port, () => console.log(`Lighthouse app listening on port ${port}!`));

app.use('//graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
}));

app.use('/', routes);