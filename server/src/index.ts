import "reflect-metadata";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";

import dataSource from "./config/db";
import { UserResolver } from "./resolvers/UserResolver";
import { ActivityResolver } from "./resolvers/ActivityResolver";
import { TypeResolver } from "./resolvers/TypeResolver";
import { CategoryResolver } from "./resolvers/CategoryResolver";

const port = parseInt(process.env.PORT || "4000", 10);

/**
 * Point d'entrée principal du serveur GraphQL
 * Initialise la base de données et démarre le serveur Apollo
 */
async function startServer() {
  await dataSource.initialize();
  const schema = await buildSchema({
    resolvers: [UserResolver, ActivityResolver, TypeResolver, CategoryResolver], // Ajout du CategoryResolver
  });
  const apolloServer = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(apolloServer, {
    listen: { port },
  });
  console.info(`Server started on ${url}`);
}
startServer();
