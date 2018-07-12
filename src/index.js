import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";


import registerServiceWorker from './registerServiceWorker';


const resolvers = {
    Todo: {
      status: () => 'RECEIVED'
    }
  };

const client = new ApolloClient({
    uri: 'https://0vnj1497n5.lp.gql.zone/graphql',
    clientState: {
        resolvers
      }
});
  
ReactDOM.render(<ApolloProvider client={client}><App /></ApolloProvider>, document.getElementById('root'));
registerServiceWorker();
