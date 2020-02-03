import ApolloClient from 'apollo-boost';
import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';

const client = new ApolloClient({
    uri: 'https://volence.dev/node_apps/lighthouse_app/graphql',
    // uri: 'http://localhost:3501//graphql',
    // 100.11.206.213
});

const sendQuery = async query => {
    try {
        let response = await client.query({
            query: query,
        });
        return response;
    } catch (err) {
        return err;
    }
};
const sendMutation = async (mutationQuery, mutationVariable) => {
    try {
        let response = await client.mutate({
            mutation: mutationQuery,
            variables: {
                siteInput: mutationVariable,
            },
        });
        return response;
    } catch (err) {
        return err;
    }
};
const sendSignInMutation = async (mutationQuery, mutationVariable) => {
    try {
        let response = await client.mutate({
            mutation: mutationQuery,
            variables: {
                clientData: mutationVariable,
            },
        });
        return response;
    } catch (err) {
        return err;
    }
};

const AppoloWrapper = ({ children }) => <ApolloProvider client={client}>{children}</ApolloProvider>;

export { sendQuery, sendMutation, sendSignInMutation, AppoloWrapper };
