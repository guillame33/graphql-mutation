import React, { Component } from "react";
import { render } from "react-dom";

import ApolloClient from "apollo-boost";
import { ApolloProvider, Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "https://8v9r9kpn7q.lp.gql.zone/graphql"
});

const ADD_TODO = gql`
mutation AddTodo($type: String!){
  addTodo(type: $type) {
    id
    type
  }
}
`;

const GET_TODOS = gql`
  {
    todos {
      id
      type
    }
  }
`;

const Todos = () => (
  <Query query={GET_TODOS}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.todos.map(({ id, type }) => {
        let input;

        return (
          <div key={id}>
            <p>{type}</p>
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!input.value.trim()) {
                  return;
                }

                input.value = "";
              }}
            >
              <input
                ref={node => {
                  input = node;
                }}
              />
              <button type="submit">Update Todo</button>
            </form>
          </div>
        );
      });
    }}
  </Query>
);

const updateTodos = (cache, { data: { addTodo } }) => {
  const currentCache = cache.readQuery({ query: GET_TODOS });
  console.log(currentCache);
  const { todos } = currentCache;
  cache.writeQuery({
    query: GET_TODOS,
    data: { todos: todos.concat([addTodo]) }
  });
};

const AddTodo = () => {
  let input;

  return (
    <Mutation mutation={ADD_TODO} update={updateTodos}>
      {addTodoToto => (
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              addTodoToto({ variables: { type: input.value.trim() } });
              input.value = "";
            }}
          >
            <input
              ref={node => {
                input = node;
              }}
            />
            <button type="submit">Add Todo</button>
          </form>
        </div>
      )}
    </Mutation>
  );
};

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h2>Building Mutation components 🚀</h2>
      <AddTodo />
      <Todos />
    </div>
  </ApolloProvider>
);

render(<App />, document.getElementById("root"));
