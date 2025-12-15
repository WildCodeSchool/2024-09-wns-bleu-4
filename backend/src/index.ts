import { dataSource } from '@/db';
import ContactResolver from '@/resolvers/ContactResolver';
import PaymentResolver from '@/resolvers/PaymentResolver';
import ReportResolver from '@/resolvers/ReportResolver';
import ResourceResolver from '@/resolvers/ResourceResolver';
import SubscriptionResolver from '@/resolvers/SubscriptionResolver';
import SystemLogResolver from '@/resolvers/SystemLogResolver';
import UserResolver from '@/resolvers/UserResolver';
import { cleanupExpiredResources } from '@/services/cleanupService';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import * as cookie from 'cookie';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import * as cron from 'node-cron';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';

const start = async () => {
    if (!process.env.JWT_SECRET_KEY) {
        throw Error('no jwt secret');
    }

    // Validate Stripe environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
        console.warn(
            'STRIPE_SECRET_KEY not found. Stripe functionality will be disabled.',
        );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.warn(
            'STRIPE_WEBHOOK_SECRET not found. Webhook verification will be disabled.',
        );
    }

    await dataSource.initialize();
    const schema = await buildSchema({
        validate: true,
        resolvers: [
            UserResolver,
            ContactResolver,
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
    // Configuration des origines autorisées pour CORS
    const allowedOrigins = [
        'https://wildtransfer.cloud',
        'https://staging.wildtransfer.cloud',
        'http://localhost:5173',
        'http://localhost:7007',
    ];

    const app = express();
    const server = new ApolloServer({ schema });

    await server.start();

    // Configuration CORS avec credentials
    app.use(
        '/',
        cors({
            origin: (origin, callback) => {
                // Autoriser les requêtes sans origine (ex: Postman, curl)
                if (!origin) {
                    return callback(null, true);
                }
                // Vérifier si l'origine est autorisée
                if (allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true,
            methods: ['GET', 'POST', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }),
        express.json(),
        expressMiddleware(server, {
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
        }),
    );

    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`🚀  Server ready at: http://localhost:${PORT}`);
    });

    // Schedule daily cleanup of expired resources at 2 AM
    cron.schedule('0 2 * * *', async () => {
        console.log('Running scheduled cleanup of expired resources...');
        try {
            await cleanupExpiredResources();
            console.log('Scheduled cleanup completed successfully');
        } catch (error) {
            console.error('Scheduled cleanup failed:', error);
        }
    });

    console.log('📅 Daily cleanup job scheduled for 2 AM');
};

start();
