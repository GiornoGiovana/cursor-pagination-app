import React, { useState } from "react";
import { Box, Button, Form, FormField, Text, TextInput } from "grommet";
import { Link, useHistory } from "react-router-dom";
import {
  EmailPasswordInput,
  MeDocument,
  MeQuery,
  useLoginMutation,
} from "../generated/graphql";

export const Login: React.FC<{}> = () => {
  const history = useHistory();
  const [login, { loading }] = useLoginMutation();
  const [isError, setIsError] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  return (
    <Box direction="row" justify="center" align="center">
      <Box width="medium">
        <Form
          value={values}
          onChange={(next) => setValues(next as any)}
          onSubmit={async ({ value }) => {
            const response = await login({
              variables: { options: value as EmailPasswordInput },
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.login,
                  },
                });
              },
            });
            if (response && response.data?.login) {
              history.push("/");
            } else {
              setIsError(true);
              setTimeout(() => setIsError(false), 2700);
            }
          }}
        >
          <FormField label="Email">
            <TextInput name="email" type="email" />
          </FormField>
          <FormField label="Password">
            <TextInput name="password" type="password" />
          </FormField>
          <Box direction="column">
            <Link to="/register">
              <Text color="neutral-3">Not register yet? Sign up here!</Text>
            </Link>
            {isError && (
              <Box animation={{ type: "fadeOut", duration: 2700 }}>
                <Text color="status-error">
                  Wrong email or password. Please try agan
                </Text>
              </Box>
            )}
            <Button
              disabled={loading}
              size="large"
              margin={{ top: "8px" }}
              type="submit"
              primary
              label="login"
            />
          </Box>
        </Form>
      </Box>
    </Box>
  );
};
