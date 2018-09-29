import React from 'react';
import { render } from 'react-dom';
import '../style/app.scss';
import ChannelList from './components/ChannelList/ChannelList';
import CreateChannel from './components/CreateChannel/CreateChannel';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import {
    ApolloClient,
    ApolloProvider,
    createNetworkInterface
} from 'react-apollo';
const networkInterface = createNetworkInterface({
    uri: 'http://192.168.0.35:8090/graphql'
});

const wsClient = new SubscriptionClient(`ws://192.168.0.35:8090/subscriptions`, {
    reconnect: true
});

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient
);

const client = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions
});

let app = document.querySelector('#app');

render(
    <ApolloProvider client={client}>
        <div className="App">
            <div>
                {/* <CreateChannel /> */}
                <ChannelList />
            </div>
        </div>
    </ApolloProvider>,
    app
)
