import "reflect-metadata";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";

import dataSource from "./config/db";
import { UserResolver } from "./UserResolver";

const port = parseInt(process.env.PORT || "4000", 10);

async function startServer() {
  await dataSource.initialize();
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });
  const apolloServer = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(apolloServer, {
    listen: { port },
  });
  console.info(`Server started on ${url}`);
}
startServer();
