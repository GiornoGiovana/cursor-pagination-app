import React, { useState } from "react";
import { Box, Button, Form, FormField, Text, TextInput } from "grommet";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { useHistory } from "react-router-dom";

export const Register: React.FC<{}> = () => {
  const history = useHistory();
  const [register] = useRegisterMutation();
  const [isError, setIsError] = useState(false);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  return (
    <Box direction="row" justify="center" align="center">
      <Box width="medium">
        <Form
          value={values}
          onChange={(next) => setValues(next as any)}
          onSubmit={async ({ value }: any) => {
            const response = await register({
              variables: {
                username: value.username,
                options: {
                  email: value.email,
                  password: value.password,
                },
              },
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.register,
                  },
                });
              },
            });
            if (response && response.data?.register) {
              history.push("/");
            } else {
              setIsError(true);
            }
          }}
        >
          <FormField label="Username">
            <TextInput name="username" />
          </FormField>
          <FormField label="Email">
            <TextInput name="email" type="email" />
          </FormField>
          <FormField label="Password">
            <TextInput name="password" type="password" />
          </FormField>
          {isError && (
            <Text color="status-error">
              An error ocurred. Please try again!
            </Text>
          )}
          <Box>
            <Button
              size="large"
              margin={{ top: "8px" }}
              type="submit"
              primary
              label="register"
            />
          </Box>
        </Form>
      </Box>
    </Box>
  );
};
