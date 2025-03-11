import { dataSource } from '@/db';
import LikeResolver from '@/resolvers/LikeResolver';
import UserResolver from '@/resolvers/UserResolver';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import 'dotenv/config';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import ResourceResolver from './resolvers/ResourceResolver';
import SubscriptionResolver from './resolvers/SubscriptionResolver';
import CommentResolver from './resolvers/CommentResolver';
import ReportResolver from './resolvers/ReportResolver';
import ContactResolver from './resolvers/ContactResolver';

const start = async () => {
    await dataSource.initialize();
    const schema = await buildSchema({
        resolvers: [
            UserResolver,
            ContactResolver,
            LikeResolver,
            CommentResolver,
            ReportResolver,
            SubscriptionResolver,
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