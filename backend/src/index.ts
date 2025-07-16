import { dataSource } from '@/db';
import CommentResolver from '@/resolvers/CommentResolver';
import ContactResolver from '@/resolvers/ContactResolver';
import LikeResolver from '@/resolvers/LikeResolver';
import ReportResolver from '@/resolvers/ReportResolver';
import ResourceResolver from '@/resolvers/ResourceResolver';
import SubscriptionResolver from '@/resolvers/SubscriptionResolver';
import SystemLogResolver from '@/resolvers/SystemLogResolver';
import UserResolver from '@/resolvers/UserResolver';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import * as cookie from 'cookie';
import cors from 'cors';
import 'dotenv/config';
import jwt, { Secret } from 'jsonwebtoken';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';

const start = async () => {
    if (!process.env.JWT_SECRET_KEY) {
        throw Error('no jwt secret');
    }
    await dataSource.initialize();
    const schema = await buildSchema({
        validate: true,
        resolvers: [
            UserResolver,
            ContactResolver,
            LikeResolver,
            CommentResolver,
            ReportResolver,
            SubscriptionResolver,
            ResourceResolver,
            SystemLogResolver,
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
        context: async ({ req, res }) => {
            // Configuration cors
            const corsOptions = {
                origin: [
                    'http://localhost:5173', // Frontend en développement local
                    'http://localhost:7007', // Via Nginx en local
                    'http://frontend:5173',  // Frontend dans Docker
                ],
                credentials: true,
                methods: ['GET', 'POST', 'OPTIONS'],
                allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
            };

            // Appliquer CORS
            cors(corsOptions)(req, res, () => {});

            if (req.headers.cookie) {
                const cookies = cookie.parse(req.headers.cookie as string);
                if (cookies.token) {
                    const payload: any = jwt.verify(
                        cookies.token,
                        process.env.JWT_SECRET_KEY as Secret,
                    );
                    console.log('payload in context', payload);
                    if (payload) {
                        console.log(
                            'payload was found and returned to resolver',
                        );
                        return {
                            email: payload.email,
                            userRole: payload.userRole,
                            res: res,
                        };
                    }
                }
            }
            return { res: res };
        },
    });
    console.log(`🚀  Server ready at: ${url}`);
};

start();
