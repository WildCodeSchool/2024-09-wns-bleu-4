import { dataSource } from '@/db';
import CommentResolver from '@/resolvers/CommentResolver';
import ContactResolver from '@/resolvers/ContactResolver';
import LikeResolver from '@/resolvers/LikeResolver';
import ReportResolver from '@/resolvers/ReportResolver';
import ResourceResolver from '@/resolvers/ResourceResolver';
import SubscriptionResolver from '@/resolvers/SubscriptionResolver';
import UserResolver from '@/resolvers/UserResolver';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import 'dotenv/config';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';

const start = async () => {
    if (
        process.env.JWT_SECRET_KEY === null ||
        process.env.JWT_SECRET_KEY === undefined
    ) {
        throw Error('no jwt secret');
    }
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
