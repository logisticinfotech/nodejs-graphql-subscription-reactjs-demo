const fs = require('fs');
const path = require('path');

import { makeExecutableSchema } from 'graphql-tools';

import { resolvers } from './resolvers';

const schemaFile = path.join(__dirname, '../schema.graphql');
const typeDefs = fs.readFileSync(schemaFile, 'utf8');

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };

