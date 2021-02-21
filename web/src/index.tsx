import React from "react";
import ReactDOM from "react-dom";
import { grommet, Grommet } from "grommet";
import { App } from "./App";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";
import "./index.css";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          movies: offsetLimitPagination(["type"]),
        },
      },
    },
  }),
  credentials: "include",
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Grommet theme={grommet}>
      <App />
    </Grommet>
  </ApolloProvider>,
  document.getElementById("root")
);
