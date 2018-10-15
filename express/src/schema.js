import {
  makeExecutableSchema
} from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `
type Channel {
    id: Int!                # "!" denotes a required field
    name: String!
  }

  type Query {
      channels: [Channel!]!
  }

  type Mutation {
      addChannel(name: String!): Channel!
      updateChannel(id:Int!,name: String!): Channel!
      deleteChannel(id: Int!): Channel!
  }

  type Subscription {
      subscriptionChannelAdded: Channel!
      subscriptionChannelUpdated: Channel!
      subscriptionChannelDeleted: Channel!
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
