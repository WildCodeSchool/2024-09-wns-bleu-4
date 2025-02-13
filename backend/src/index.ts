import 'reflect-metadata';
import "dotenv/config";
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { dataSource } from '@/db';
import { buildSchema } from 'type-graphql';
import LikeResolver from '@/resolvers/LikeResolver';
import UserResolver from '@/resolvers/UserResolver';

const start = async () => {
    await dataSource.initialize();
    const schema = await buildSchema({ 
        resolvers: [UserResolver, LikeResolver],
        authChecker: ({ context }, rolesForOperation) => {
            if (context.email) {
              if (rolesForOperation.length === 0) {
                return true;
              } else {
                if (rolesForOperation.includes(context.userRole)) {
                  return true;
                } else {
                  return false;
                }
              }
            } else {
              return false;
            }
          },
     });
    const server = new ApolloServer({ schema });
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
    });
    console.log(`🚀  Server ready at: ${url}`);
};

start();
