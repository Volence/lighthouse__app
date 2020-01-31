import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
    // uri: 'https://volence.dev/node_apps/lighthouse_app/graphql',
    uri: 'http://localhost:3501//graphql',
    // 100.11.206.213
});

const sendQuery = query => {
    return new Promise(async (res, rej) => {
        try {
            let response = await client.query({
                query: query,
            });
            res(response);
        } catch (err) {
            rej(err);
        }
    });
};
const sendMutation = (mutationQuery, mutationVariable) => {
    console.log('mutationVariable ', mutationVariable);
    return new Promise(async (res, rej) => {
        try {
            let response = await client.mutate({
                mutation: mutationQuery,
                variables: {
                    siteInput: mutationVariable,
                },
            });
            res(response);
        } catch (err) {
            rej(err);
        }
    });
};

export { sendQuery, sendMutation };
