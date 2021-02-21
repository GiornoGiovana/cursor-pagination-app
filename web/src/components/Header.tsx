import React from "react";
import { Box, Button, Nav, Text } from "grommet";
import { Link } from "react-router-dom";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  const { data, loading, error } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();
  let body = null;

  if (error) return <Box color="status-error">{error.message}</Box>;

  if (!loading && !data?.me) {
    body = (
      <Nav direction="row">
        <Link to="/register">
          <Text color="brand">register</Text>
        </Link>
        <Link to="/login">
          <Text color="brand">login</Text>
        </Link>
      </Nav>
    );
  } else {
    body = (
      <Nav direction="row" align="center">
        <Text color="brand">{data?.me?.username}</Text>
        <Button
          label="logout"
          onClick={async () => {
            await logout();
            await client.resetStore();
          }}
        />
      </Nav>
    );
  }

  return (
    <Box background="status-ok" pad="medium">
      <Box
        direction="row"
        justify="between"
        align="center"
        width={{ min: "800px" }}
        margin="auto"
      >
        <Link to="/">
          <Text color="brand" size="large">
            LearnXi
          </Text>
        </Link>
        {body}
      </Box>
    </Box>
  );
};
