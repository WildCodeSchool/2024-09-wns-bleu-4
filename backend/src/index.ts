import "dotenv/config";
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { dataSource } from '@/db';
import { buildSchema } from 'type-graphql';



const start = async () => {
    await dataSource.initialize();
    const schema = await buildSchema({ resolvers: [] });
    const server = new ApolloServer({ schema: dataSource });
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
    });
    console.log(`🚀  Server ready at: ${url}`);
};
start();
