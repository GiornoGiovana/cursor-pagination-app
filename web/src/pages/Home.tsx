import React from "react";
import { Box, Button, Card, CardBody, CardFooter, CardHeader } from "grommet";
import { Favorite, ShareOption } from "grommet-icons";
import { useMoviesQuery } from "../generated/graphql";

export const Home: React.FC<{}> = () => {
  const { data, loading, fetchMore } = useMoviesQuery({
    variables: {
      limit: 10,
      offset: 0,
    },
  });

  if (loading) return <Box>Loading...</Box>;

  return (
    <Box flex align="center" justify="center">
      {data?.movies.map((movie) => (
        <Card
          key={movie.id}
          height="medium"
          width="large"
          background="light-1"
          margin={{ top: "6px" }}
        >
          <CardHeader pad="medium">{movie.title}</CardHeader>
          <CardBody pad="medium">{movie.info}</CardBody>
          <CardFooter pad={{ horizontal: "small" }} background="light-2">
            <Button icon={<Favorite color="red" />} hoverIndicator />
            <Button icon={<ShareOption color="plain" />} hoverIndicator />
          </CardFooter>
        </Card>
      ))}
      {!(data?.movies.length === 100) && (
        <Button
          margin="20px"
          primary
          label="Load More"
          onClick={() => {
            fetchMore({
              variables: {
                offset: data?.movies.length,
              },
            });
          }}
        />
      )}
    </Box>
  );
};
