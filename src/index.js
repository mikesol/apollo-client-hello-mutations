import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import registerServiceWorker from './registerServiceWorker';

const client = new ApolloClient({
    uri: "https://8v9r9kpn7q.lp.gql.zone/graphql"
});
  
ReactDOM.render(<ApolloProvider client={client}><App /></ApolloProvider>, document.getElementById('root'));
registerServiceWorker();
