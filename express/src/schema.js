import {
  makeExecutableSchema
} from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `
type Channel {
  id: ID!                # "!" denotes a required field
  name: String
}

type Message {
  id: ID!
  text: String
}

# This type specifies the entry points into our API
type Query {
  channels: [Channel]    # "[]" means this is a list of channels
}

# The mutation root type, used to define all mutations
type Mutation {
  addChannel(name: String!): Channel
  updateChannel(id:Int!,name: String!): Channel
  deleteChannel(id:Int!): Channel
}

# The subscription root type, specifying what we can subscribe to
type Subscription {
    channelAdded: Channel
    channelUpdated: Channel
    channelDeleted: Channel
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
