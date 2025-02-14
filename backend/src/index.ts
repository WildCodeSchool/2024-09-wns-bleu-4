import { dataSource } from '@/db';
import LikeResolver from '@/resolvers/LikeResolver';
import UserResolver from '@/resolvers/UserResolver';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import 'dotenv/config';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import ResourceResolver from './resolvers/ResourceResolver';
import SubscribtionResolver from './resolvers/SubscribtionResolver';

const start = async () => {
    await dataSource.initialize();
    const schema = await buildSchema({
        resolvers: [
            UserResolver,
            LikeResolver,
            SubscribtionResolver,
            ResourceResolver,
        ],
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
