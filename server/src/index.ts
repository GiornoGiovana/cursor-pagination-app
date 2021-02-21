import "dotenv/config";
import "reflect-metadata";
import express from "express";
import session from "express-session";
import cors from "cors";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolver/user";
import { MovieResolver } from "./resolver/movie";

declare module "express-session" {
  export interface SessionData {
    userId: number;
  }
}

const main = async () => {
  await createConnection();

  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  app.use(
    session({
      name: process.env.COOKIE_NAME,
      secret: process.env.SECRET!,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, //1 day
      },
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, MovieResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => console.log("Server started"));
};

main();
