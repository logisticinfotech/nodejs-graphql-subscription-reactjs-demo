const fs = require('fs');
const path = require('path');

import { makeExecutableSchema } from 'graphql-tools';

import { resolvers } from './resolvers';

const schemaFile = path.join(__dirname, '../schema.graphql');
const typeDefs = fs.readFileSync(schemaFile, 'utf8');

// import schemaql from '../schema.graphql';
// console.log("Hey");
// console.log(schemaql);

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };

// const schema = makeExecutableSchema({ typeDefs });
// const executableSchema = makeExecutableSchema({
//     typeDefs: typeDefs,
//     resolvers: resolvers,
// });

// export { executableSchema };
