import "reflect-metadata";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";

import dataSource from "./config/db";
import ActivityResolver from "./resolvers/ActivityResolver";
import AvatarResolver from "./resolvers/AvatarResolver";
import CategoryResolver from "./resolvers/CategoryResolver";
import FriendResolver from "./resolvers/FriendResolver";
import InteractionResolver from "./resolvers/InteractionResolver";
import TypeResolver from "./resolvers/TypeResolver";
import UserResolver from "./resolvers/UserResolver";

import { seedAvatars } from "./seeders/Seeder";

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
    resolvers: [
      UserResolver,
      ActivityResolver,
      TypeResolver,
      CategoryResolver,
      AvatarResolver,
      FriendResolver,
      InteractionResolver,
    ],
  });
  const apolloServer = new ApolloServer({ schema });
  const stamp = new Date().toISOString();
  console.info(`[dev-watch] Reload backend at ${stamp}`);
  const { url } = await startStandaloneServer(apolloServer, {
    listen: { port },
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace('Bearer ', '') || null;
      return { token };
    },
  });
  console.info(`Server started on ${url}`);
  seedAvatars();
}
startServer();
