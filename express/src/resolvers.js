import { PubSub } from 'graphql-subscriptions';
var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'gqlgenreact'
});

const CHANNEL_ADDED_TOPIC = 'subscriptionChannelAdded';
const CHANNEL_UPDATE_TOPIC = 'subscriptionChannelUpdated';
const CHANNEL_DELETE_TOPIC = 'subscriptionChannelDeleted';
const pubsub = new PubSub();

export const resolvers = {
  Query: {
    channels: () => {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * from channel', function (err, rows, fields) {
          if (err) throw err
          resolve(rows)
        })
      });
    }
  },
  Mutation: {
    addChannel: (root, args) => {
      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO channel (name) VALUES (?)', [args.name], function (err, rows) {
          if (err) throw err
          const newChannel = { name: args.name, id: rows.insertId };
          console.log("newChannel :", newChannel);
          pubsub.publish(CHANNEL_ADDED_TOPIC, {subscriptionChannelAdded: newChannel});
          resolve(newChannel)
        })
      });
    }, updateChannel: (root, args) => {
      return new Promise((resolve, reject) => {
        connection.query('UPDATE channel SET name=? WHERE id=?', [args.name, args.id], function (err, rows) {
          if (err) throw err
          const newChannel = { name: args.name, id: args.id };
          pubsub.publish(CHANNEL_UPDATE_TOPIC, { subscriptionChannelUpdated: newChannel });
          resolve(newChannel)
        })
      });

    }, deleteChannel: (root, args) => {
      return new Promise((resolve, reject) => {
        console.log(args);
        connection.query('DELETE FROM channel WHERE id=?', [args.id], function (err, rows) {
          console.log(err);
          if (err) throw err
          const newChannel = { name: "", id: args.id };
          console.log(newChannel);
          pubsub.publish(CHANNEL_DELETE_TOPIC, { subscriptionChannelDeleted: newChannel });
          resolve(newChannel)
        })
      });

    }
  },
  Subscription: {
    subscriptionChannelAdded: {
      subscribe: () => pubsub.asyncIterator(CHANNEL_ADDED_TOPIC)
    },
    subscriptionChannelUpdated: {
      subscribe: () => pubsub.asyncIterator(CHANNEL_UPDATE_TOPIC)
    },
    subscriptionChannelDeleted: {
      subscribe: () => pubsub.asyncIterator(CHANNEL_DELETE_TOPIC)
    }
  }
};
