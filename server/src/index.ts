import "reflect-metadata";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";

import dataSource from "./config/db";
import UserResolver from "./resolvers/UserResolver";

const port = parseInt(process.env.PORT || "4000", 10);

async function startServer() {
  await dataSource
    .initialize()
    .then(() => {
      console.info("Database connection established");
    })
    .catch((error) => {
      console.error("Error during Data Source initialization:", error);
      process.exit(1);
    });
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
