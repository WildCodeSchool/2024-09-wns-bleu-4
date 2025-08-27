import { dataSource } from '@/db';
import CommentResolver from '@/resolvers/CommentResolver';
import ContactResolver from '@/resolvers/ContactResolver';
import LikeResolver from '@/resolvers/LikeResolver';
import PaymentResolver from '@/resolvers/PaymentResolver';
import ReportResolver from '@/resolvers/ReportResolver';
import ResourceResolver from '@/resolvers/ResourceResolver';
import SubscriptionResolver from '@/resolvers/SubscriptionResolver';
import SystemLogResolver from '@/resolvers/SystemLogResolver';
import UserResolver from '@/resolvers/UserResolver';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import * as cookie from 'cookie';
import 'dotenv/config';
import jwt, { Secret } from 'jsonwebtoken';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';

const start = async () => {
    if (!process.env.JWT_SECRET_KEY) {
        throw Error('no jwt secret');
    }

    // Validate Stripe environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
        console.warn('STRIPE_SECRET_KEY not found. Stripe functionality will be disabled.');
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.warn('STRIPE_WEBHOOK_SECRET not found. Webhook verification will be disabled.');
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
            PaymentResolver,
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
            if (req.headers.cookie) {
                const cookies = cookie.parse(req.headers.cookie as string);
                if (cookies.token) {
                    try {
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
                    } catch (error) {
                        console.log('JWT verification failed:', error.message);
                    }
                }
            }
            return { res: res };
        },
    });
    console.log(`🚀  Server ready at: ${url}`);
};

start();
