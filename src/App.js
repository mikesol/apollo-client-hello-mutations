import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import gql from "graphql-tag";
import { Mutation, Query } from "react-apollo";

const addNewEntryToClient = (client, addTodo) => {
  const { todos } = client.readQuery({ query: GET_TODOS });
  const toWrite = {
      query: GET_TODOS,
      data: {
        todos: todos.concat([
          addTodo
      ])
    }
  }
  client.writeQuery(toWrite);
}

const GET_TODOS = gql`
  {
    todos {
      id
      type
      status @client
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($type: String!) {
    addTodo(type: $type) {
      id
      type
      status @client
    }
  }
`;

const UPDATE_TODO = gql`
  mutation updateTodo($id: String!, $type: String!) {
    updateTodo(id: $id, type: $type) {
      id
      type
      status @client
    }
  }
`;

const Todos = () => (
  <Query query={GET_TODOS}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.todos.map(({ id, type, status }) => {
        let input;

        return (
          <Mutation mutation={UPDATE_TODO} key={id}>
            {(updateTodo, { loading, error }) => (
              <div>
                <p>{status === 'PENDING' ? '(pending)' : status === 'FAILED' ? '(failed)' : '(confirmed)'} {type}</p>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    updateTodo({
                      optimisticResponse: {
                        updateTodo: {
                          __typename: 'Todo',
                          id,
                          type: input.value,
                          status: 'PENDING'
                        }
                      },
                      variables: { id, type: input.value }
                    });

                    input.value = "";
                  }}
                >
                  <input
                    ref={node => {
                      input = node;
                    }}
                  />
                  <button type="submit">Update Todo</button>
                  {loading && <span>Sending to server...</span>}
                  {error && <span>Error :( Please try again</span>}
                </form>
              </div>
            )}
          </Mutation>
        );
      });
    }}
  </Query>
);

const AddTodo = () => {
  let input;
  let previousInput;

  return (
    <Mutation
      mutation={ADD_TODO}
      update={(cache, { data: { addTodo } }) => {
        addNewEntryToClient(cache, addTodo);
      }}
    >
      {(addTodo, { data, loading, error, client }) => {
        return (
          <div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                try {
                  await addTodo({
                    optimisticResponse: {
                      addTodo: {
                        __typename: 'Todo',
                        id: `${Math.round(Math.random() * -1000000)}`,
                        type: input.value,
                        status: 'PENDING'
                      }
                    },
                    variables: { type: input.value }
                  });
                } catch (e) {
                  addNewEntryToClient(client, {
                    __typename: 'Todo',
                    id: `${Math.round(Math.random() * -1000000)}`,
                    type: previousInput.value,
                    status: 'FAILED'
                  });
                } finally {
                  input.value = "";
                }
              }}
            >
              <input
                ref={node => {
                  input = node;
                  previousInput = node;
                }}
              />
              <button type="submit">Add Todo</button>
            </form>
            {loading && <p>Sending to server...</p>}
            {error && <p>Error :( Please try again</p>}
          </div>
        );
      }}
    </Mutation>
  );
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Todos />
        <AddTodo />
      </div>
    );
  }
}

export default App;
